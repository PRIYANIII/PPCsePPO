import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Send, Loader2, CheckCircle2, XCircle, Clock, 
  ChevronLeft, Maximize2, Minimize2, Code2, Terminal, SplitSquareVertical 
} from 'lucide-react';
import { codingAPI, dsaAPI } from '../api/client';
import Editor from '@monaco-editor/react';

export default function CodingPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [customInput, setCustomInput] = useState('');
  const [splitView, setSplitView] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);

  const boilerplateCode = {
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    python: `# Your code here\ndef solve():\n    pass\n\nif __name__ == "__main__":\n    solve()`,
    c: `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}`
  };

  useEffect(() => {
    loadQuestion();
    loadSubmissions();
  }, [questionId]);

  const loadQuestion = async () => {
    try {
      const data = await dsaAPI.getQuestion(questionId);
      setQuestion(data);
      setCode(boilerplateCode[language]);
    } catch (error) {
      console.error('Error loading question:', error);
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await codingAPI.getSubmissions(questionId);
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('');
    setTestResults(null);
    try {
      const result = await codingAPI.runCode(questionId, {
        code,
        language,
        customInput
      });
      if (result.testResults) {
        setTestResults(result.testResults);
        if (customInput) {
          setOutput(result.testResults[0]?.actualOutput || '');
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await codingAPI.submitCode(questionId, { code, language });
      setTestResults(result.testResults);
      if (result.submission?.status === 'accepted') {
        setOutput('✅ All test cases passed!');
      }
      loadSubmissions();
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const statusIcons = {
    accepted: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    wrong_answer: <XCircle className="w-4 h-4 text-red-500" />,
    time_limit_exceeded: <Clock className="w-4 h-4 text-yellow-500" />,
    runtime_error: <XCircle className="w-4 h-4 text-red-500" />,
    compilation_error: <XCircle className="w-4 h-4 text-orange-500" />
  };

  if (!question) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen pt-16 flex flex-col bg-white dark:bg-[#0b1120]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#131c31] border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-md">
            {question.title}
          </h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            question.difficulty === 'easy' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' :
            question.difficulty === 'medium' ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' :
            'text-red-600 bg-red-50 dark:bg-red-900/20'
          }`}>
            {question.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(boilerplateCode[e.target.value]);
            }}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-300"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="c">C</option>
          </select>
          <button
            onClick={() => setSplitView(!splitView)}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          >
            <SplitSquareVertical className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        {splitView && (
          <div className="w-1/2 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="flex">
                {['description', 'submissions'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'description' ? 'Description' : 'Submissions'}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'description' ? (
                <>
                  <div className="prose dark:prose-invert max-w-none mb-6">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {question.description}
                    </p>
                  </div>

                  {question.examples?.map((example, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Example {index + 1}:
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <strong>Input:</strong> {example.input}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <strong>Output:</strong> {example.output}
                        </p>
                        {example.explanation && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <strong>Explanation:</strong> {example.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {question.constraints?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Constraints:
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {question.constraints.map((constraint, index) => (
                          <li key={index} className="text-sm text-slate-600 dark:text-slate-400">
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission, index) => (
                    <div
                      key={submission._id || index}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {statusIcons[submission.status] || <Code2 className="w-4 h-4" />}
                        <span className={`text-sm font-medium ${
                          submission.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {submission.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{submission.language}</span>
                        <span>{submission.runtime}ms</span>
                        <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-8">
                      No submissions yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code Editor and Output */}
        <div className={`${splitView ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                fontSize,
                minimap: { enabled: false },
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="h-64 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#131c31] border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Output</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Custom input..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="px-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-300 w-32"
                />
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                >
                  {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  Run
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  Submit
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto h-[calc(100%-2.5rem)]">
              {testResults ? (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm ${
                        result.passed
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {result.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-medium ${result.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                          Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Input: {result.input}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Expected: {result.expectedOutput}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Output: {result.actualOutput}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                  {output || 'Run your code to see output here...'}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}