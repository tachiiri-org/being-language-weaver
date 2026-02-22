import type { Doc } from '../types/doc'

export const seedDoc: Doc = {
  meta: {
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  vocab: {
    relationTypes: ['parent', 'refines', 'dependsOn'],
    statusOptions: ['draft', 'active'],
  },
  graph: {
    nodes: [
      { id: 'existence',      label: '存在',       position: { x: 400, y: 50  } },
      { id: 'perception',     label: '知覚',       position: { x: 400, y: 150 } },
      { id: 'disclosure',     label: '開示',       position: { x: 400, y: 250 } },
      { id: 'projection',     label: '投企',       position: { x: 400, y: 350 } },
      { id: 'identity',       label: '自己同一性', position: { x: 400, y: 450 } },
      { id: 'worldview',      label: '世界観',     position: { x: 400, y: 550 } },
      { id: 'language',       label: '言語',       position: { x: 400, y: 650 } },
      { id: 'world',          label: '世界',       position: { x: 400, y: 750 } },
    ],
    edges: [
      { id: 'e1', source: 'existence',  target: 'perception', type: 'refines'   },
      { id: 'e2', source: 'perception', target: 'disclosure', type: 'refines'   },
      { id: 'e3', source: 'disclosure', target: 'projection', type: 'refines'   },
      { id: 'e4', source: 'projection', target: 'identity',   type: 'refines'   },
      { id: 'e5', source: 'identity',   target: 'worldview',  type: 'refines'   },
      { id: 'e6', source: 'worldview',  target: 'language',   type: 'refines'   },
      { id: 'e7', source: 'language',   target: 'world',      type: 'refines'   },
    ],
  },
  concepts: {
    existence: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '存在とは全てである' },
        { kind: 'text', title: '関係', value: '「存在」は「知覚」できる' },
      ],
    },
    perception: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '知覚とは存在を感じる事である' },
        { kind: 'text', title: '関係', value: '「知覚」は「開示」を起こす' },
      ],
    },
    disclosure: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '開示とは「存在」を「存在者」に変える事である' },
        { kind: 'text', title: '関係', value: '「開示」は「投企」を生む' },
      ],
    },
    projection: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '投企とは「自己」と「存在者」の関係を望ましいものに変えようとする意志である' },
        { kind: 'text', title: '関係', value: '「投企」は「自己同一性」を生む' },
      ],
    },
    identity: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '自己同一性とは「投企」を抽象化したパターンである' },
        { kind: 'text', title: '関係', value: '「自己同一性」は「世界観」を生む' },
      ],
    },
    worldview: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '世界観とは「存在者」ではない「存在」への「投企」を「自己同一性」によって定義したものである' },
        { kind: 'text', title: '関係', value: '「世界観」は「言語」で伝えられる' },
      ],
    },
    language: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '言語とは「世界観」を他の「自己」と共有するためのものである' },
        { kind: 'text', title: '関係', value: '「言語」が同じ人たちで「世界」ができる' },
      ],
    },
    world: {
      status: 'active',
      fields: {},
      definitionBlocks: [
        { kind: 'text', title: '定義', value: '世界とは「言語」を共有する人の集まりである' },
      ],
    },
  },
}
