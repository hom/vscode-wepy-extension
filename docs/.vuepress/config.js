module.exports = {
  title: 'Wepy',
  description: 'Vue tooling for VS Code.',
  base: '/wepy/',
  markdown: {
    linkify: true
  },
  themeConfig: {
    repo: 'vuejs/wepy',
    editLinks: true,
    docsDir: 'docs',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Reference', link: '/reference/' },
      { text: 'FAQ', link: '/guide/FAQ' },
      { text: 'Roadmap', link: 'https://github.com/vuejs/wepy/issues/873' },
      { text: 'Credits', link: '/credits' },
      { text: 'Contribution Guide', link: 'https://github.com/vuejs/wepy/wiki#contribution-guide' }
    ],
    sidebar: {
      '/guide/': [
        '',
        'setup',
        {
          title: 'Features',
          collapsable: false,
          children: [
            'highlighting',
            'snippet',
            'emmet',
            'linting-error',
            'formatting',
            'intellisense',
            'debugging',
            'component-data',
            'interpolation',
            'vti',
            'global-components'
          ]
        },
        'FAQ'
      ],
      '/reference/': ['', 'tsconfig']
    }
  }
};
