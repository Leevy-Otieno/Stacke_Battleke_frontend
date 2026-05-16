import React from 'react';
import Editor from '@monaco-editor/react';

export default function Challenge() {
  const codeTemplate = `def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:\n    # Start coding here...\n    pass`;

  return (
    <div className="fixed inset-0 top-16 left-64 bg-white flex z-0">
      {/* Description Pane - Left Panel */}
      <div className="w-1/2 border-r border-slate-200 overflow-y-auto flex flex-col">
        <div className="border-b border-slate-100 px-6 py-3 bg-slate-50 flex gap-4 text-xs font-semibold text-slate-400">
          <button className="text-brand-blue border-b-2 border-brand-blue pb-3 pt-1">Description</button>
          <button className="pb-3 pt-1 hover:text-slate-700">Editorial</button>
          <button className="pb-3 pt-1 hover:text-slate-700">Solutions</button>
          <button className="pb-3 pt-1 hover:text-slate-700">Submissions</button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">1. Invert Binary Tree <span className="text-xs bg-emerald-50 text-emerald-500 font-bold px-2 py-0.5 rounded ml-2 uppercase">Easy</span></h2>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              Given the <code className="bg-slate-100 font-mono text-xs px-1 py-0.5 rounded text-brand-blue">root</code> of a binary tree, invert the tree, and return its root.
            </p>
          </div>

          <div className="w-full aspect-square bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 font-mono">
             {"</>"}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Example 1:</h3>
            <div className="bg-slate-50 font-mono text-xs p-4 rounded-lg border border-slate-100 space-y-1">
              <p><span className="text-slate-400">Input:</span> root = [4,2,7,1,3,6,9]</p>
              <p><span className="text-slate-400">Output:</span> [4,7,2,9,6,3,1]</p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">Constraints:</h3>
            <ul className="list-disc list-inside font-mono text-xs text-slate-500 space-y-1">
              <li>The number of nodes in the tree is in the range [0, 100].</li>
              <li>-100 &lt;= Node.val &lt;= 100</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Editor Pane - Right Panel */}
      <div className="w-1/2 flex flex-col h-full bg-slate-50">
        <div className="h-11 border-b border-slate-200 px-4 bg-white flex items-center justify-between">
          <select className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-600">
            <option>Python3</option>
            <option>C++</option>
            <option>Go</option>
          </select>
        </div>

        <div className="flex-1 min-h-0 relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            defaultValue={codeTemplate}
            theme="vs"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollbar: { vertical: 'auto' },
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Action Panel Console */}
        <div className="border-t border-slate-200 bg-white p-4 flex flex-col gap-4">
          <div className="text-xs font-mono text-slate-400">
            &gt; Run code to see results...
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-lg">Run Code</button>
            <button className="px-5 py-2 bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}