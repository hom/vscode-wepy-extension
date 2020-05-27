import { platform } from 'os';
import Uri from 'vscode-uri';

/**
 * Vetur mainly deals with paths / uris from two objects
 *
 * - `TextDocument` from `vscode-languageserver`
 * - `SourceFile` from `typescript`
 *
 * TypeScript Language Service uses `fileName`, which is a file path without scheme.
 * Convert them into standard URI by `Uri.file`.
 *
 * ## `TextDocument.uri`
 *
 * - macOS / Linux: file:///foo/bar.wpy
 * - Windows: file:///c%3A/foo/bar.wpy (%3A is `:`)
 *
 * ## `SourceFile.fileName`
 *
 * - macOS / Linux: /foo/bar.wpy
 * - Windows: c:/foo/bar.wpy
 *
 * ## vscode-uri
 *
 * - `Uri.parse`: Takes full URI starting with `file://`
 * - `Uri.file`: Takes file path
 *
 * ### `fsPath` vs `path`
 *
 * - macOS / Linux:
 * ```
 * > Uri.parse('file:///foo/bar.wpy').fsPath
 * '/foo/bar.wpy'
 * > Uri.parse('file:///foo/bar.wpy').path
 * '/foo/bar.wpy'
 * ```
 * - Windows
 * ```
 * > Uri.parse('file:///c%3A/foo/bar.wpy').fsPath
 * 'c:\\foo\\bar.wpy' (\\ escapes to \)
 * > Uri.parse('file:///c%3A/foo/bar.wpy').path
 * '/c:/foo/bar.wpy'
 * ```
 */

export function getFileFsPath(documentUri: string): string {
  return Uri.parse(documentUri).fsPath;
}

export function getFilePath(documentUri: string): string {
  const IS_WINDOWS = platform() === 'win32';
  if (IS_WINDOWS) {
    // Windows have a leading slash like /C:/Users/pine
    // vscode-uri use lower-case drive letter
    // https://github.com/microsoft/vscode-uri/blob/95e03c06f87d38f25eda1ae3c343fe5b7eec3f52/src/index.ts#L1017
    return Uri.parse(documentUri).path.replace(/^\/[a-zA-Z]/, (s: string) => s.slice(1).toLowerCase());
  } else {
    return Uri.parse(documentUri).path;
  }
}

export function normalizeFileNameToFsPath(fileName: string) {
  return Uri.file(fileName).fsPath;
}
