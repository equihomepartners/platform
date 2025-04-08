import React from 'react';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Portfolio Management Dashboard</h1>
        <p>Strategic engine for analyzing TLS data, simulating portfolio scenarios, and directing underwriting.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>$50M</h3>
            <p>Fund Size</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>16%</h3>
            <p>Current IRR</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="stat-content">
            <h3>90%</h3>
            <p>Green Zones</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-home"></i>
          </div>
          <div className="stat-content">
            <h3>342</h3>
            <p>Properties</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Portfolio Composition</h2>
            <div className="section-actions">
              <button className="action-button">
                <i className="fas fa-download"></i> Export
              </button>
              <button className="action-button">
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>Portfolio composition chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Zone Distribution</h2>
            <div className="section-actions">
              <button className="action-button">
                <i className="fas fa-download"></i> Export
              </button>
              <button className="action-button">
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>Zone distribution chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Scenarios</h2>
            <div className="section-actions">
              <button className="action-button primary">
                <i className="fas fa-plus"></i> New Scenario
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Scenario Name</th>
                    <th>Created</th>
                    <th>IRR</th>
                    <th>Risk</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Increase Orange Zones</td>
                    <td>2023-04-15</td>
                    <td>17.2%</td>
                    <td>Medium</td>
                    <td><span className="status-badge simulated">Simulated</span></td>
                    <td>
                      <button className="table-action-btn"><i className="fas fa-eye"></i></button>
                      <button className="table-action-btn"><i className="fas fa-edit"></i></button>
                      <button className="table-action-btn"><i className="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Diversify Geography</td>
                    <td>2023-04-14</td>
                    <td>16.5%</td>
                    <td>Low</td>
                    <td><span className="status-badge implemented">Implemented</span></td>
                    <td>
                      <button className="table-action-btn"><i className="fas fa-eye"></i></button>
                      <button className="table-action-btn"><i className="fas fa-edit"></i></button>
                      <button className="table-action-btn"><i className="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Reduce LTV</td>
                    <td>2023-04-12</td>
                    <td>15.8%</td>
                    <td>Very Low</td>
                    <td><span className="status-badge draft">Draft</span></td>
                    <td>
                      <button className="table-action-btn"><i className="fas fa-eye"></i></button>
                      <button className="table-action-btn"><i className="fas fa-edit"></i></button>
                      <button className="table-action-btn"><i className="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
