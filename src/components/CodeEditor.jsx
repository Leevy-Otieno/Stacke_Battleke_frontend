import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { submitCode } from "../services/api";

const CodeEditor = ({ challenge, onSubmissionComplete }) => {
  // Default to JavaScript since that's the primary language for your stack
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here...");
  
  // Terminal and Execution State
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState("idle"); // idle, running, success, error

  // Load starter code when the challenge loads
  useEffect(() => {
    if (challenge) {
      const starterCode = challenge.starter_code_javascript || `function solve() {\n  // Write your solution for ${challenge.title} here\n\n}\n`;
      setCode(starterCode);
      addTerminalLine(`Loaded challenge: ${challenge.title}`, "system");
      addTerminalLine("Ready for execution...", "system");
    }
  }, [challenge]);

  const addTerminalLine = (text, type = "normal") => {
    setTerminalOutput((prev) => [...prev, { text, type }]);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async (isSubmit = false) => {
    if (!challenge) return;
    
    setIsExecuting(true);
    setExecutionStatus("running");
    
    const actionText = isSubmit ? "Submitting to hidden tests..." : "Running public tests...";
    setTerminalOutput([{ text: `> ${actionText}`, type: "system" }]);

    try {
      // Call your backend execution service
      const response = await submitCode(challenge.id, code, language);
      
      // Handle the backend response format
      if (response && response.success) {
        setExecutionStatus("success");
        addTerminalLine(`Status: Accepted`, "success");
        addTerminalLine(`Score: ${response.score || challenge.points_reward} points`, "success");
        
        // If your backend returns stdout/console logs from the user's code
        if (response.output) {
          addTerminalLine(`Output:\n${response.output}`, "normal");
        }

        if (isSubmit && onSubmissionComplete) {
          onSubmissionComplete(response);
        }
      } else {
        // Handled as a failed test case
        setExecutionStatus("error");
        addTerminalLine(`Status: Failed`, "error");
        addTerminalLine(`Error: ${response?.error || response?.message || "Test cases failed"}`, "error");
        
        if (response?.traceback) {
          addTerminalLine(response.traceback, "error");
        }
      }
    } catch (error) {
      setExecutionStatus("error");
      addTerminalLine(`Execution Error: Server unreachable or timeout.`, "error");
      addTerminalLine(error.message, "error");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-[800px] w-full border border-gray-700 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl">
      
      {/* --- EDITOR HEADER --- */}
      <div className="flex justify-between items-center bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 font-semibold text-sm">Editor</span>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-sm text-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 transition"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setCode(challenge?.starter_code_javascript || "")}
            className="text-xs text-gray-400 hover:text-gray-200 transition"
          >
            Reset Code
          </button>
        </div>
      </div>

      {/* --- MONACO EDITOR --- */}
      <div className="flex-grow relative">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          }}
        />
      </div>

      {/* --- TERMINAL WINDOW --- */}
      <div className="h-64 flex flex-col border-t border-gray-700 bg-black">
        <div className="bg-gray-800 px-4 py-1 flex justify-between items-center text-xs text-gray-400">
          <span>Terminal Output</span>
          <button onClick={() => setTerminalOutput([])} className="hover:text-white">Clear</button>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto font-mono text-sm leading-relaxed">
          {terminalOutput.length === 0 ? (
            <span className="text-gray-600">No output. Run your code to see results.</span>
          ) : (
            terminalOutput.map((line, idx) => (
              <div key={idx} className={`whitespace-pre-wrap ${
                line.type === "error" ? "text-red-400" : 
                line.type === "success" ? "text-green-400" : 
                line.type === "system" ? "text-blue-400 font-bold" : 
                "text-gray-300"
              }`}>
                {line.text}
              </div>
            ))
          )}
          {isExecuting && (
            <div className="text-yellow-400 animate-pulse mt-2">Running...</div>
          )}
        </div>
      </div>

      {/* --- ACTION FOOTER --- */}
      <div className="bg-gray-800 px-4 py-3 flex justify-end space-x-3 border-t border-gray-700">
        <button
          onClick={() => handleRunCode(false)}
          disabled={isExecuting}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-200 bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
        >
          Run Code
        </button>
        
        <button
          onClick={() => handleRunCode(true)}
          disabled={isExecuting}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-500 transition shadow-lg disabled:opacity-50 flex items-center"
        >
          {isExecuting ? "Evaluating..." : "Submit Solution"}
        </button>
      </div>

    </div>
  );
};

export default CodeEditor;