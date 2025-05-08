/// <reference types="cypress" />

// Custom command to sign up and complete the diagnostic scan
Cypress.Commands.add('signupAndScan', (options = {}) => {
  const username = options.username || `test_user_${Date.now()}`;
  const password = options.password || 'Password123!';
  const displayName = options.displayName || 'Test User';
  
  // Visit registration page
  cy.visit('/auth');
  cy.contains('h2', 'Register').should('be.visible');
  
  // Fill in registration form
  cy.get('form').within(() => {
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="displayName"]').type(displayName);
    cy.get('button[type="submit"]').click();
  });
  
  // Wait for diagnostic to appear
  cy.url().should('include', '/diagnosis');
  cy.contains('Skill Diagnostic').should('be.visible');
  
  // Complete diagnostic questions
  cy.get('form').should('be.visible').within(() => {
    // Answer experience level question
    cy.contains('label', 'Intermediate').click();
    cy.get('button').contains('Next').click();
    
    // Answer interest area question
    cy.contains('label', 'Machine Learning').click();
    cy.get('button').contains('Next').click();
    
    // Answer goal question
    cy.contains('label', 'Career advancement').click();
    cy.get('button').contains('Next').click();
    
    // Submit the diagnostic
    cy.get('button').contains('Complete').click();
  });
  
  // Verify completion and redirect to dashboard
  cy.url().should('include', '/dashboard');
  cy.contains('Welcome').should('be.visible');
  
  return cy.wrap({ username, password });
});

// Custom command to complete a skill probe test
Cypress.Commands.add('probePrompt', (promptText) => {
  // Navigate to skill probe section
  cy.visit('/skills-dna');
  cy.contains('Take Skill Assessment').click();
  
  // Verify probe is displayed
  cy.contains('Skill Probe').should('be.visible');
  
  // Enter prompt text in the probe
  cy.get('textarea').type(promptText);
  
  // Submit the probe
  cy.contains('button', 'Submit').click();
  
  // Verify completion and feedback
  cy.contains('Assessment Complete').should('be.visible');
  cy.contains('button', 'View Results').click();
  
  // Should return to skills page with updated radar
  cy.url().should('include', '/skills-dna');
  cy.contains('Your Skills DNA').should('be.visible');
});

// Custom command to start a course and complete a lesson
Cypress.Commands.add('startCourse', (courseName) => {
  // Navigate to courses page
  cy.visit('/dashboard');
  
  // Find and click on the specified course
  cy.contains('.course-card', courseName).click();
  
  // Verify course page loaded
  cy.contains('h1', courseName).should('be.visible');
  
  // Start the course
  cy.contains('button', 'Start Learning').click();
  
  // Return a chainable object with a completeLesson method
  return cy.wrap({
    completeLesson: () => {
      // Should be on lesson page now
      cy.url().should('include', '/lessons/');
      
      // Find and interact with lesson content
      cy.contains('button', 'Next').click({ multiple: true, force: true });
      
      // Complete any quiz or interactive elements
      cy.get('.quiz-container').then($quiz => {
        if ($quiz.length) {
          // Select first option for all quiz questions
          cy.get('.option-button').first().click();
          cy.contains('button', 'Submit').click();
        }
      });
      
      // Mark lesson as complete
      cy.contains('button', 'Complete').click({ force: true });
      
      // Verify completion
      cy.contains('Lesson completed').should('be.visible');
      
      // Return to dashboard
      cy.contains('a', 'Dashboard').click();
      cy.url().should('include', '/dashboard');
    }
  });
});

// Custom command to check user navigation when not authenticated
Cypress.Commands.add('checkUnauthenticatedExperience', () => {
  cy.visit('/dashboard');
  cy.contains('Please sign in').should('be.visible');
  cy.contains('button', 'Sign In').should('be.visible');
});

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to sign up and complete the diagnostic scan
       * @example cy.signupAndScan()
       */
      signupAndScan(options?: { username?: string; password?: string; displayName?: string }): Chainable<{ username: string; password: string }>;
      
      /**
       * Custom command to complete a skill probe test
       * @example cy.probePrompt('Write a GPT prompt for analyzing data')
       */
      probePrompt(promptText: string): Chainable<Element>;
      
      /**
       * Custom command to start a course and return a chainable with completeLesson method
       * @example cy.startCourse('AI Fundamentals').completeLesson()
       */
      startCourse(courseName: string): Chainable<{ completeLesson: () => void }>;
      
      /**
       * Custom command to check user experience when not authenticated
       * @example cy.checkUnauthenticatedExperience()
       */
      checkUnauthenticatedExperience(): Chainable<Element>;
    }
  }
}