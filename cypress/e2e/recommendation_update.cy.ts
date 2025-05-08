/// <reference types="cypress" />

describe('Course Recommendation Update Tests', () => {
  beforeEach(() => {
    // Start each test with a fresh user who has completed diagnostic
    cy.signupAndScan();
    
    // Verify we're on dashboard and can see recommendations
    cy.visit('/dashboard');
    cy.contains('Recommended for You').should('be.visible');
  });
  
  it('Updates recommendations after completing a lesson', () => {
    // Capture initial recommendation courses and scores
    const initialRecommendations = [];
    
    cy.get('.course-card').each(($card) => {
      const title = $card.find('.title').text().trim();
      const scoreText = $card.find('.match-score').text().trim();
      const score = parseInt(scoreText.replace(/[^0-9]/g, ''));
      
      initialRecommendations.push({ title, score });
    }).then(() => {
      cy.task('log', 'Initial recommendations:');
      cy.task('table', initialRecommendations);
      
      // Start and complete a course lesson
      cy.contains('.course-card', 'Основы искусственного интеллекта').click();
      
      // Verify course page loaded
      cy.contains('h1', 'Основы искусственного интеллекта').should('be.visible');
      
      // Start the course
      cy.contains('button', 'Start Learning').click();
      
      // Should be on lesson page now
      cy.url().should('include', '/lessons/');
      
      // Complete the lesson
      cy.contains('button', 'Next').click({ multiple: true, force: true });
      
      // Complete any quiz or interactive elements if present
      cy.get('body').then($body => {
        if ($body.find('.quiz-container').length) {
          cy.get('.option-button').first().click();
          cy.contains('button', 'Submit').click();
        }
      });
      
      // Mark lesson as complete
      cy.contains('button', 'Complete').click({ force: true });
      
      // Verify completion
      cy.contains('Lesson completed').should('be.visible');
      
      // Go to dashboard and check for recommendation changes
      cy.visit('/dashboard');
      cy.contains('Recommended for You').should('be.visible');
      
      // Capture new recommendations and compare
      const updatedRecommendations = [];
      let recommendationsChanged = false;
      
      cy.get('.course-card').each(($card) => {
        const title = $card.find('.title').text().trim();
        const scoreText = $card.find('.match-score').text().trim();
        const score = parseInt(scoreText.replace(/[^0-9]/g, ''));
        
        updatedRecommendations.push({ title, score });
        
        // Check if this course's score changed from initial recommendations
        const initialCourse = initialRecommendations.find(r => r.title === title);
        if (initialCourse && initialCourse.score !== score) {
          recommendationsChanged = true;
          cy.task('log', `Course "${title}" score changed from ${initialCourse.score}% to ${score}%`);
        }
      }).then(() => {
        cy.task('log', 'Updated recommendations:');
        cy.task('table', updatedRecommendations);
        
        // Check if any course ordering changed
        if (JSON.stringify(initialRecommendations.map(r => r.title)) !== 
            JSON.stringify(updatedRecommendations.map(r => r.title))) {
          recommendationsChanged = true;
          cy.task('log', 'Course recommendation order changed');
        }
        
        // Validate that recommendations were updated
        expect(recommendationsChanged).to.be.true;
      });
    });
  });
  
  it('Shows course recommendations with modelScore indicators', () => {
    // This test focuses specifically on the modelScore display
    cy.visit('/dashboard');
    
    // All recommendation cards should have a match score
    cy.get('.course-card').each(($card) => {
      // Each card should show a match percentage
      cy.wrap($card).within(() => {
        cy.get('.match-score')
          .should('exist')
          .invoke('text')
          .then((text) => {
            const percentage = parseInt(text.replace(/[^0-9]/g, ''));
            expect(percentage).to.be.at.least(1); // Should be > 0
            expect(percentage).to.be.at.most(100); // Should be <= 100%
            
            cy.task('log', `Found course with match score: ${percentage}%`);
          });
      });
    });
  });
  
  it('Updates Skills DNA radar after lesson completion', () => {
    // Check initial skills radar
    cy.visit('/skills-dna');
    cy.get('.radar-chart').should('exist');
    
    // Store initial skill levels
    const initialSkills = {};
    cy.get('.skill-item').each(($el) => {
      const skillName = $el.find('.skill-name').text().trim();
      const levelText = $el.find('.skill-level').text().trim();
      const level = parseInt(levelText.replace('lvl', '').trim());
      initialSkills[skillName] = level;
    }).then(() => {
      cy.task('log', 'Initial skill levels:');
      cy.task('table', initialSkills);
      
      // Complete a lesson
      cy.startCourse('Основы искусственного интеллекта')
        .completeLesson();
      
      // Check if skill radar updated
      cy.visit('/skills-dna');
      cy.get('.radar-chart').should('exist');
      
      // Verify at least one skill level has changed
      let skillLevelsChanged = false;
      cy.get('.skill-item').each(($el) => {
        const skillName = $el.find('.skill-name').text().trim();
        const levelText = $el.find('.skill-level').text().trim();
        const newLevel = parseInt(levelText.replace('lvl', '').trim());
        
        if (initialSkills[skillName] !== undefined && newLevel > initialSkills[skillName]) {
          skillLevelsChanged = true;
          cy.task('log', `Skill increased: ${skillName} from lvl ${initialSkills[skillName]} to lvl ${newLevel}`);
        }
      }).then(() => {
        expect(skillLevelsChanged).to.be.true;
      });
    });
  });
});