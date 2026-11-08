import React, { useState } from 'react';
import { useJarvis } from '../../../context/JarvisContext';
import { CheckSquareIcon, PlusIcon, TrashIcon, SparklesIcon } from '../../common/Icons';

export default function TaskManagementModule() {
  const { tasks, addTask, updateTaskStatus, deleteTask } = useJarvis();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('high');
  const [subagent, setSubagent] = useState('Code Architect Agent');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || 'Autonomous directive execution.',
      priority,
      subagent,
    });

    setTitle('');
    setDescription('');
  };

  const statusCategories = [
    { key: 'pending', label: 'QUEUED DIRECTIVES', color: 'yellow' },
    { key: 'in-progress', label: 'AUTONOMOUS EXECUTION', color: 'cyan' },
    { key: 'completed', label: 'VERIFIED & COMPLETE', color: 'green' },
  ];

  return (
    <div className="module-view task-management-module">
      <div className="module-header-row">
        <div className="module-title-group">
          <div className="module-icon-wrapper">
            <CheckSquareIcon />
          </div>
          <div>
            <h2 className="module-heading">06 // AUTONOMOUS TASK MANAGEMENT</h2>
            <p className="module-subheading">
              Subagent fleet orchestration, background pipelines, and directive queues.
            </p>
          </div>
        </div>

        {/* Fleet Status Metrics */}
        <div className="fleet-metrics-row">
          <div className="fleet-metric-pill">
            <span className="dot-green"></span>
            <span>SUBAGENTS: 4/4 READY</span>
          </div>
          <div className="fleet-metric-pill">
            <span className="dot-cyan"></span>
            <span>TOTAL DIRECTIVES: {tasks.length}</span>
          </div>
        </div>
      </div>

      {/* Top: Add New Directive Form */}
      <div className="hud-card task-creation-card">
        <div className="card-top-header">
          <span>// DISPATCH NEW AUTONOMOUS DIRECTIVE</span>
          <span className="text-cyan">FLEET CONTROLLER</span>
        </div>

        <form onSubmit={handleCreate} className="task-form-inline">
          <div className="form-input-group flex-2">
            <label>DIRECTIVE TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audit API gateway endpoints and implement rate-limiting"
              className="hud-input"
              required
            />
          </div>

          <div className="form-input-group flex-3">
            <label>SPECIFICATIONS</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed instructions or validation criteria..."
              className="hud-input"
            />
          </div>

          <div className="form-input-group flex-1">
            <label>PRIORITY</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="hud-select"
            >
              <option value="high">High (Level 1)</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="form-input-group flex-1">
            <label>SUBAGENT</label>
            <select
              value={subagent}
              onChange={(e) => setSubagent(e.target.value)}
              className="hud-select"
            >
              <option value="Code Architect Agent">Code Architect</option>
              <option value="DevOps Synthesizer">DevOps Synthesizer</option>
              <option value="Security Auditor">Security Auditor</option>
              <option value="Research Subagent">Research Subagent</option>
            </select>
          </div>

          <div className="form-submit-group">
            <button type="submit" className="hud-action-btn primary">
              <PlusIcon />
              <span>DISPATCH</span>
            </button>
          </div>
        </form>
      </div>

      {/* Kanban / Multi-Column Status Grid */}
      <div className="task-columns-grid">
        {statusCategories.map((cat) => {
          const categoryTasks = tasks.filter((t) => t.status === cat.key);

          return (
            <div key={cat.key} className={`task-column col-${cat.color}`}>
              <div className="column-header">
                <span className={`column-dot ${cat.color}`}></span>
                <span className="column-name">{cat.label}</span>
                <span className="column-count">{categoryTasks.length}</span>
              </div>

              <div className="column-tasks-list">
                {categoryTasks.length === 0 ? (
                  <div className="empty-column-state">
                    <span>No directives in this state.</span>
                  </div>
                ) : (
                  categoryTasks.map((task) => (
                    <div key={task.id} className="task-card-item">
                      <div className="task-top-meta">
                        <span className={`priority-badge ${task.priority}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="subagent-name">{task.subagent}</span>
                        <button
                          className="task-delete-btn"
                          onClick={() => deleteTask(task.id)}
                          title="Cancel directive"
                        >
                          <TrashIcon className="trash-icon" />
                        </button>
                      </div>

                      <h4 className="task-card-title">{task.title}</h4>
                      <p className="task-card-desc">{task.description}</p>

                      {/* Progress Bar */}
                      <div className="task-progress-box">
                        <div className="progress-labels">
                          <span>PROGRESS</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="task-track">
                          <div
                            className={`task-fill ${task.status}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="task-actions-row">
                        {task.status !== 'in-progress' && task.status !== 'completed' && (
                          <button
                            className="task-state-btn start"
                            onClick={() => updateTaskStatus(task.id, 'in-progress')}
                          >
                            ▶ START EXECUTION
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <button
                            className="task-state-btn complete"
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                          >
                            ✓ MARK COMPLETE
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <span className="completed-stamp">✓ VERIFIED BY SUBAGENT</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
