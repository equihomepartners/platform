import { test, expect } from '@playwright/test';

test.describe('Portfolio Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8001/');
  });

  test('should display the dashboard title', async ({ page }) => {
    const title = await page.textContent('.dashboard-header h1');
    expect(title).toBe('Portfolio Management Dashboard');
  });

  test('should display the stats cards', async ({ page }) => {
    const statCards = await page.$$('.stat-card');
    expect(statCards.length).toBe(4);
    
    const fundSize = await page.textContent('.stat-card:nth-child(1) h3');
    expect(fundSize).toBe('$50M');
    
    const irr = await page.textContent('.stat-card:nth-child(2) h3');
    expect(irr).toBe('16%');
    
    const greenZones = await page.textContent('.stat-card:nth-child(3) h3');
    expect(greenZones).toBe('90%');
    
    const properties = await page.textContent('.stat-card:nth-child(4) h3');
    expect(properties).toBe('342');
  });

  test('should display the recent scenarios table', async ({ page }) => {
    const tableRows = await page.$$('.data-table tbody tr');
    expect(tableRows.length).toBe(3);
    
    const firstScenarioName = await page.textContent('.data-table tbody tr:first-child td:first-child');
    expect(firstScenarioName).toBe('Increase Orange Zones');
  });

  test('should navigate to different sections using the sidebar', async ({ page }) => {
    // Click on Portfolio link
    await page.click('.sidebar-nav a[href="/portfolio"]');
    await expect(page).toHaveURL(/.*\/portfolio/);
    
    // Click on Scenarios link
    await page.click('.sidebar-nav a[href="/scenarios"]');
    await expect(page).toHaveURL(/.*\/scenarios/);
    
    // Click on Parameters link
    await page.click('.sidebar-nav a[href="/parameters"]');
    await expect(page).toHaveURL(/.*\/parameters/);
    
    // Click on TLS Integration link
    await page.click('.sidebar-nav a[href="/tls-integration"]');
    await expect(page).toHaveURL(/.*\/tls-integration/);
    
    // Click on Underwriting link
    await page.click('.sidebar-nav a[href="/underwriting"]');
    await expect(page).toHaveURL(/.*\/underwriting/);
    
    // Click on Settings link
    await page.click('.sidebar-nav a[href="/settings"]');
    await expect(page).toHaveURL(/.*\/settings/);
    
    // Go back to Dashboard
    await page.click('.sidebar-nav a[href="/"]');
    await expect(page).toHaveURL(/.*\//);
  });

  test('should toggle sidebar when clicking the toggle button', async ({ page }) => {
    // Check initial state
    const initialSidebarWidth = await page.$eval('.app-sidebar', el => getComputedStyle(el).width);
    
    // Click toggle button
    await page.click('.sidebar-toggle');
    
    // Check collapsed state
    const collapsedSidebarWidth = await page.$eval('.app-sidebar', el => getComputedStyle(el).width);
    expect(collapsedSidebarWidth).not.toBe(initialSidebarWidth);
    
    // Click toggle button again
    await page.click('.sidebar-toggle');
    
    // Check expanded state
    const expandedSidebarWidth = await page.$eval('.app-sidebar', el => getComputedStyle(el).width);
    expect(expandedSidebarWidth).toBe(initialSidebarWidth);
  });
});
