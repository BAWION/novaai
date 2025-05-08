# Cypress Tests for NovaAI University

This directory contains end-to-end tests for the NovaAI University platform, focusing on key user flows and critical functionality.

## Test Structure

- `commands.ts`: Custom Cypress commands for common operations like signup, lesson completion, etc.
- `e2e/*.cy.ts`: Test specifications organized by feature

### Main Test Files

1. **bridge_flow.cy.ts**: 
   - Tests the complete flow from registration → diagnosis → skill probe → lesson → updated skills radar → recommendations
   - Validates the "wow effect" of the platform, ensuring updates propagate properly

2. **skills-dna-flow.cy.ts**: 
   - Tests specific Skills DNA radar updates after skill probe completion
   - Validates that course recommendations update based on skill changes

3. **recommendation_update.cy.ts**:
   - Focused tests on recommendation algorithm behavior
   - Validates modelScore display and recommendation ordering changes

4. **edge_cases.cy.ts**:
   - Tests edge cases like users without diagnostic data
   - Ensures appropriate UI is shown when authentication is missing

## Running Tests

### Interactive Mode

To open Cypress in interactive mode:

```bash
./open-cypress.sh
```

This will open the Cypress Test Runner, allowing you to select and run specific test files.

### Headless Mode

To run all tests in headless mode:

```bash
./run-cypress.sh
```

To run a specific test file:

```bash
./run-cypress.sh cypress/e2e/bridge_flow.cy.ts
```

## Timing and Performance

The tests include timing measurements for the complete end-to-end flow, with a target of ≤90 seconds for the entire bridge flow. This provides valuable metrics for optimizing user experience.

## CI Integration

These tests can be integrated into CI pipelines to ensure that critical flows continue to work after code changes.