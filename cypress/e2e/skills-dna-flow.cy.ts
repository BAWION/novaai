/// <reference types="cypress" />

describe('Skills DNA Flow Tests', () => {
  beforeEach(() => {
    // Create a user and complete diagnostic for each test
    cy.signupAndScan();
  });
  
  it('Updates Skills DNA radar after completing a skill probe', () => {
    // Initial check of skills data
    cy.visit('/skills-dna');
    cy.get('.radar-chart').should('exist');
    
    // Store initial skill levels
    let initialLevels: Record<string, number> = {};
    cy.get('.skill-item').each(($el) => {
      const skillName = $el.find('.skill-name').text().trim();
      const levelText = $el.find('.skill-level').text().trim();
      const level = parseInt(levelText.replace('lvl', '').trim());
      initialLevels[skillName] = level;
    }).then(() => {
      cy.task('log', 'Initial skill levels:');
      cy.task('table', initialLevels);
      
      // Complete a skill probe focused on prompt engineering
      cy.probePrompt('Write a prompt that generates a concise business summary from quarterly financial reports');
      
      // Check if skill levels updated
      cy.visit('/skills-dna');
      cy.get('.radar-chart').should('exist');
      
      // Verify at least one skill level has increased
      let skillsUpdated = false;
      cy.get('.skill-item').each(($el) => {
        const skillName = $el.find('.skill-name').text().trim();
        const levelText = $el.find('.skill-level').text().trim();
        const newLevel = parseInt(levelText.replace('lvl', '').trim());
        
        if (initialLevels[skillName] !== undefined && newLevel > initialLevels[skillName]) {
          skillsUpdated = true;
          cy.task('log', `Skill increased: ${skillName} from lvl ${initialLevels[skillName]} to lvl ${newLevel}`);
        }
      }).then(() => {
        expect(skillsUpdated).to.be.true;
      });
    });
  });
  
  it('Updates recommended courses after lesson completion', () => {
    // Get initial recommendations
    cy.visit('/dashboard');
    let initialRecommendations: string[] = [];
    
    cy.get('.course-card .title').each(($el) => {
      initialRecommendations.push($el.text().trim());
    }).then(() => {
      cy.task('log', 'Initial recommendations:');
      cy.task('log', initialRecommendations);
      
      // Complete a lesson
      cy.startCourse('Основы искусственного интеллекта')
        .completeLesson();
      
      // Check if recommendations updated
      cy.visit('/dashboard');
      cy.contains('Recommended for You').should('be.visible');
      
      // Verify modelScore is displayed
      cy.get('.course-card').should('contain.text', 'match');
      
      // Check if recommendations changed
      let recommendationsChanged = false;
      let newRecommendations: string[] = [];
      
      cy.get('.course-card .title').each(($el) => {
        newRecommendations.push($el.text().trim());
      }).then(() => {
        cy.task('log', 'New recommendations:');
        cy.task('log', newRecommendations);
        
        // Check if order or content of recommendations changed
        if (
          JSON.stringify(initialRecommendations) !== JSON.stringify(newRecommendations) &&
          newRecommendations.length > 0
        ) {
          recommendationsChanged = true;
        }
        
        expect(recommendationsChanged).to.be.true;
      });
    });
  });
  
  it('Shows model score on recommended courses', () => {
    cy.visit('/dashboard');
    cy.contains('Recommended for You').should('be.visible');
    
    // Verify modelScore is displayed on each course card
    cy.get('.course-card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.match-score')
          .should('exist')
          .and('contain.text', '%')
          .invoke('text')
          .then((text) => {
            // Extract numeric value from match score
            const percentage = parseInt(text.replace(/[^0-9]/g, ''));
            expect(percentage).to.be.at.least(1); // Should have a score > 0
            expect(percentage).to.be.at.most(100); // Should be <= 100%
          });
      });
    });
  });
});