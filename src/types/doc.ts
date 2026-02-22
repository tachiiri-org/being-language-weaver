export type RelationType = 'parent' | 'refines' | 'dependsOn'
export type StatusOption = 'draft' | 'active'

export type DefinitionBlock =
  | { kind: 'text'; title: string; value: string }
  | { kind: 'bullets'; title: string; items: string[] }
  | { kind: 'links'; title: string; nodeIds: string[] }

export interface GraphNode {
  id: string
  label: string
  position: { x: number; y: number }
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: RelationType
}

export interface Concept {
  status: StatusOption
  fields: Record<string, string>
  definitionBlocks: DefinitionBlock[]
}

export interface Doc {
  meta: {
    version: number
    updatedAt: string
  }
  vocab: {
    relationTypes: RelationType[]
    statusOptions: StatusOption[]
  }
  graph: {
    nodes: GraphNode[]
    edges: GraphEdge[]
  }
  concepts: Record<string, Concept>
}
