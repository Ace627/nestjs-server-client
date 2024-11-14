export {}

declare module 'vue' {
  export interface GlobalComponents {
    ApTag: typeof import('../src/components/ApTag/index.vue')['default']
    ApTaiChi: typeof import('../src/components/ApTaiChi/index.vue')['default']
    ApTable: typeof import('../src/components/ApTable/index.vue')['default']
    ApViewPdf: typeof import('../src/components/ApViewPdf/index.vue')['default']
    ApWrapList: typeof import('../src/components/ApWrapList/index.vue')['default']
    ApPagination: typeof import('../src/components/ApPagination/index.vue')['default']

    IconFont: typeof import('../src/components/IconFont/index.vue')['default']
    IconSelect: typeof import('../src/components/IconSelect/index.vue')['default']
    InnerLink: typeof import('../src/components/InnerLink/index.vue')['default']
    QRCode: typeof import('../src/components/QRCode/index.vue')['default']
  }
}
