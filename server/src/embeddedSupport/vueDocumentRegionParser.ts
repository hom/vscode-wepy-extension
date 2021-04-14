import type { TextDocument } from 'vscode-languageserver-textdocument';
import { createScanner, TokenType, Scanner } from '../modes/template/parser/htmlScanner';
import { removeQuotes } from '../utils/strings';
import { LanguageId } from './embeddedSupport';

export type RegionType = 'template' | 'script' | 'style' | 'custom';

export interface EmbeddedRegion {
  languageId: LanguageId;
  start: number;
  end: number;
  type: RegionType;
}

const defaultScriptLang = 'javascript';
const defaultCSSLang = 'css';

export function parseVueDocumentRegions(document: TextDocument) {
  const regions: EmbeddedRegion[] = [];
  const text = document.getText();
  const scanner = createScanner(text);
  let lastTagName = '';
  let lastAttributeName = '';
  let languageIdFromType: LanguageId | '' = '';
  const importedScripts: string[] = [];
  let stakes = 0;

  let token = scanner.scan();
  while (token !== TokenType.EOS) {
    switch (token) {
      case TokenType.Styles:
        regions.push({
          languageId: /^(sass|scss|less|postcss|stylus)$/.test(languageIdFromType)
            ? (languageIdFromType as LanguageId)
            : defaultCSSLang,
          start: scanner.getTokenOffset(),
          end: scanner.getTokenEnd(),
          type: 'style'
        });
        languageIdFromType = '';
        break;
      case TokenType.Script:
        regions.push({
          languageId: languageIdFromType ? languageIdFromType : defaultScriptLang,
          start: scanner.getTokenOffset(),
          end: scanner.getTokenEnd(),
          type: 'script'
        });
        languageIdFromType = '';
        break;
      case TokenType.StartTag:
        stakes++;
        const tagName = scanner.getTokenText();
        if (tagName === 'template' && stakes === 1) {
          const templateRegion = scanTemplateRegion(scanner, text);
          if (templateRegion) {
            regions.push(templateRegion);
          }
        } else if (!['style', 'script'].includes(tagName) && stakes === 1) {
          const customRegion = scanCustomRegion(tagName, scanner, text);
          if (customRegion) {
            regions.push(customRegion);
          }
        }
        lastTagName = tagName;
        lastAttributeName = '';
        break;
      case TokenType.AttributeName:
        lastAttributeName = scanner.getTokenText();
        break;
      case TokenType.AttributeValue:
        if (lastAttributeName === 'lang') {
          languageIdFromType = getLanguageIdFromLangAttr(scanner.getTokenText());
        } else {
          if (lastAttributeName === 'src' && lastTagName.toLowerCase() === 'script') {
            let value = scanner.getTokenText();
            if (value[0] === "'" || value[0] === '"') {
              value = value.slice(1, value.length - 1);
            }
            importedScripts.push(value);
          }
        }
        lastAttributeName = '';
        break;
      case TokenType.StartTagSelfClose:
      case TokenType.EndTagClose:
        stakes--;
        lastAttributeName = '';
        languageIdFromType = '';
        break;
    }
    token = scanner.scan();
  }

  return {
    regions,
    importedScripts
  };
}

function scanTemplateRegion(scanner: Scanner, text: string): EmbeddedRegion | null {
  let languageId: LanguageId = 'vue-html';

  let token = -1;
  let start = 0;
  let end: number;

  // Scan until finding matching template EndTag
  // Also record immediate next StartTagClose to find start
  let unClosedTemplate = 1;
  let lastAttributeName = null;
  while (unClosedTemplate !== 0) {
    // skip parsing on non html syntax, just search terminator
    if (token === TokenType.AttributeValue && languageId !== 'vue-html') {
      while (![TokenType.StartTagClose, TokenType.StartTagSelfClose].includes(token)) {
        token = scanner.scan();
      }
      start = scanner.getTokenEnd();

      token = scanner.scanForRegexp(/<\/template>/);
      if (token === TokenType.EOS) {
        return null;
      }

      // scan to `EndTag`, past `</` to `template`
      while (token !== TokenType.EndTag) {
        token = scanner.scan();
      }
      break;
    }

    token = scanner.scan();

    if (token === TokenType.EOS) {
      return null;
    }

    if (start === 0) {
      if (token === TokenType.AttributeName) {
        lastAttributeName = scanner.getTokenText();
      } else if (token === TokenType.AttributeValue) {
        if (lastAttributeName === 'lang') {
          languageId = getLanguageIdFromLangAttr(scanner.getTokenText());
        }
        lastAttributeName = null;
      } else if (token === TokenType.StartTagClose) {
        start = scanner.getTokenEnd();
      }
    } else {
      if (token === TokenType.StartTag && scanner.getTokenText() === 'template') {
        unClosedTemplate++;
      } else if (token === TokenType.EndTag && scanner.getTokenText() === 'template') {
        unClosedTemplate--;
        // test leading </template>
        const charPosBeforeEndTag = scanner.getTokenOffset() - 3;
        if (text[charPosBeforeEndTag] === '\n') {
          break;
        }
      } else if (token === TokenType.Unknown) {
        if (scanner.getTokenText().charAt(0) === '<') {
          const offset = scanner.getTokenOffset();
          const unknownText = text.substr(offset, 11);
          if (unknownText === '</template>') {
            unClosedTemplate--;
            // test leading </template>
            if (text[offset - 1] === '\n') {
              return {
                languageId,
                start,
                end: offset,
                type: 'template'
              };
            }
          }
        }
      }
    }
  }

  // In EndTag, find end
  // -2 for </
  end = scanner.getTokenOffset() - 2;

  return {
    languageId,
    start,
    end,
    type: 'template'
  };
}

function scanCustomRegion(tagName: string, scanner: Scanner, text: string): EmbeddedRegion | null {
  let languageId: LanguageId = 'unknown';

  let token = -1;
  let start = 0;
  let end: number;

  // Scan until finding matching template EndTag
  // Also record immediate next StartTagClose to find start
  let unClosedTag = 1;
  let lastAttributeName = null;
  while (unClosedTag !== 0) {
    token = scanner.scan();

    if (token === TokenType.EOS) {
      return null;
    }

    if (start === 0) {
      if (token === TokenType.AttributeName) {
        lastAttributeName = scanner.getTokenText();
      } else if (token === TokenType.AttributeValue) {
        if (lastAttributeName === 'lang') {
          languageId = getLanguageIdFromLangAttr(scanner.getTokenText());
        }
        lastAttributeName = null;
      } else if (token === TokenType.StartTagClose) {
        start = scanner.getTokenEnd();
      }
    } else {
      if (token === TokenType.StartTag && scanner.getTokenText() === tagName) {
        unClosedTag++;
      } else if (token === TokenType.EndTag && scanner.getTokenText() === tagName) {
        unClosedTag--;
        // test leading </${tagName}>
        const charPosBeforeEndTag = scanner.getTokenOffset() - 3;
        if (text[charPosBeforeEndTag] === '\n') {
          break;
        }
      } else if (token === TokenType.Unknown) {
        if (scanner.getTokenText().charAt(0) === '<') {
          const offset = scanner.getTokenOffset();
          const unknownText = text.substr(offset, `</${tagName}>`.length);
          if (unknownText === `</${tagName}>`) {
            unClosedTag--;
            // test leading </${tagName}>
            if (text[offset - 1] === '\n') {
              return {
                languageId,
                start,
                end: offset,
                type: 'custom'
              };
            }
          }
        }
      }
    }
  }

  // In EndTag, find end
  // -2 for </
  end = scanner.getTokenOffset() - 2;

  return {
    languageId,
    start,
    end,
    type: 'custom'
  };
}

function getLanguageIdFromLangAttr(lang: string): LanguageId {
  let languageIdFromType = removeQuotes(lang);
  if (languageIdFromType === 'jade') {
    languageIdFromType = 'pug';
  }
  if (languageIdFromType === 'ts') {
    languageIdFromType = 'typescript';
  }
  return languageIdFromType as LanguageId;
}
