import { useState, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node as RFNode,
  type Edge as RFEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import type { Doc, DefinitionBlock } from './types/doc'
import { seedDoc } from './data/seed'

const STORAGE_KEY = 'being-language-weaver-doc'

function loadDoc(): Doc {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Doc
  } catch {
    // ignore
  }
  return seedDoc
}

function buildRFNodes(doc: Doc): RFNode[] {
  return doc.graph.nodes.map((n) => ({
    id: n.id,
    position: n.position,
    data: { label: n.label },
  }))
}

function buildRFEdges(doc: Doc): RFEdge[] {
  return doc.graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.type,
  }))
}

function BlockView({ block }: { block: DefinitionBlock }) {
  if (block.kind === 'text') {
    return (
      <div className="block">
        <div className="block-title">{block.title}</div>
        <div className="block-value">{block.value}</div>
      </div>
    )
  }
  if (block.kind === 'bullets') {
    return (
      <div className="block">
        <div className="block-title">{block.title}</div>
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }
  if (block.kind === 'links') {
    return (
      <div className="block">
        <div className="block-title">{block.title}</div>
        <ul>
          {block.nodeIds.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      </div>
    )
  }
  return null
}

export default function App() {
  const [doc, setDoc] = useState<Doc>(loadDoc)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [rfNodes, , onNodesChange] = useNodesState(buildRFNodes(doc))
  const [rfEdges, setRFEdges, onEdgesChange] = useEdgesState(buildRFEdges(doc))

  const onConnect = useCallback(
    (connection: Connection) => {
      setRFEdges((eds) => addEdge(connection, eds))
    },
    [setRFEdges],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: RFNode) => {
    setSelectedId(node.id)
  }, [])

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: RFNode) => {
      setDoc((prev) => ({
        ...prev,
        graph: {
          ...prev.graph,
          nodes: prev.graph.nodes.map((n) =>
            n.id === node.id ? { ...n, position: node.position } : n,
          ),
        },
      }))
    },
    [],
  )

  const handleSave = () => {
    const updated: Doc = {
      ...doc,
      meta: { ...doc.meta, updatedAt: new Date().toISOString() },
      graph: {
        nodes: rfNodes.map((n) => ({
          id: n.id,
          label: String(n.data.label),
          position: n.position,
        })),
        edges: rfEdges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: (e.label ?? 'refines') as Doc['graph']['edges'][number]['type'],
        })),
      },
    }
    setDoc(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const selectedNode = doc.graph.nodes.find((n) => n.id === selectedId)
  const selectedConcept = selectedId ? doc.concepts[selectedId] : null

  return (
    <div className="app">
      {/* Left pane: Definition Editor */}
      <div className="pane-left">
        <div className="pane-header">
          <span>Definition Editor</span>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
        <div className="pane-content">
          {!selectedNode && (
            <div>
              <p style={{ fontSize: 13, color: '#888', marginTop: 0 }}>
                右のグラフからノードを選択してください
              </p>
              <ul className="node-list">
                {doc.graph.nodes.map((n) => (
                  <li
                    key={n.id}
                    className={`node-item${selectedId === n.id ? ' selected' : ''}`}
                    onClick={() => setSelectedId(n.id)}
                  >
                    {n.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedNode && selectedConcept && (
            <div className="concept-editor">
              <h2>{selectedNode.label}</h2>
              <div style={{ marginBottom: 12 }}>
                <span className={`status-badge ${selectedConcept.status}`}>
                  {selectedConcept.status}
                </span>
              </div>
              {selectedConcept.definitionBlocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>
          )}
          {selectedNode && !selectedConcept && (
            <div className="placeholder">このノードの定義がありません</div>
          )}
        </div>
      </div>

      {/* Right pane: Graph View */}
      <div className="pane-right">
        <div className="pane-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <span>Graph View</span>
        </div>
        <div style={{ width: '100%', height: '100%', paddingTop: 40 }}>
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDragStop={onNodeDragStop}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
