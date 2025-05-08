/// <reference types="cypress" />

describe('Edge Case Tests', () => {
  it('Shows callout instead of recommendations if user has no diagnostic data', () => {
    // Create a new user but skip the diagnostic part
    const username = `no_diag_user_${Date.now()}`;
    const password = 'Password123!';
    
    // Register without completing diagnostic
    cy.visit('/auth');
    cy.contains('h2', 'Register').should('be.visible');
    
    cy.get('form').within(() => {
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('input[name="displayName"]').type('No Diag User');
      cy.get('button[type="submit"]').click();
    });
    
    // After registration, user should see diagnostic page
    cy.url().should('include', '/diagnosis');
    
    // Skip the diagnosis by directly navigating to dashboard
    cy.visit('/dashboard', { failOnStatusCode: false });
    
    // Should see callout to complete diagnostic
    cy.contains('Complete your skill diagnostic').should('be.visible');
    cy.contains('Recommended for You').should('not.exist');
    
    // Click the callout and verify it takes user to diagnostic
    cy.contains('Take Diagnostic').click();
    cy.url().should('include', '/diagnosis');
  });
  
  it('Handles unauthorized access gracefully', () => {
    // Clear any existing sessions
    cy.clearCookies();
    
    // Try to access protected pages
    cy.visit('/dashboard', { failOnStatusCode: false });
    cy.contains('Please sign in').should('be.visible');
    
    cy.visit('/skills-dna', { failOnStatusCode: false });
    cy.contains('Please sign in').should('be.visible');
    
    cy.visit('/courses/1/lessons/1', { failOnStatusCode: false });
    cy.contains('Please sign in').should('be.visible');
  });
  
  it('Shows appropriate UI for completed course lessons', () => {
    // Create a user and complete diagnostic
    cy.signupAndScan();
    
    // Start a course and complete a lesson
    cy.startCourse('Основы искусственного интеллекта')
      .completeLesson();
    
    // Visit the course page again
    cy.visit('/dashboard');
    cy.contains('.course-card', 'Основы искусственного интеллекта').click();
    
    // Should see a "Continue Learning" button instead of "Start Learning"
    cy.contains('button', 'Continue Learning').should('be.visible');
    cy.contains('button', 'Start Learning').should('not.exist');
    
    // Should show progress indicator
    cy.get('.progress-indicator').should('exist');
    
    // Click continue and verify it takes user to next lesson
    cy.contains('button', 'Continue Learning').click();
    cy.url().should('include', '/lessons/');
  });
});