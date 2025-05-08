#!/bin/bash

# Script to run Cypress tests

# Default to running all tests if no argument is provided
SPEC_PATTERN=${1:-"cypress/e2e/*.cy.ts"}

# Run the Cypress tests
npx cypress run --spec "$SPEC_PATTERN"