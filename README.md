# Code Smith

Code Smith is a prompt-driven software toolkit for architects, auditors, and AI-assisted development teams. It combines reusable master prompts with real-world examples to help you:

- audit existing code and product implementations,
- design technical blueprints from PRDs,
- define consistent AI-driven workflow behavior.

## Project Structure

The repository currently contains:

- `agent-workflows/work-flows-generator.md`
- `code-evaluator/example.md`
- `code-evaluator/prodution-quality-and-security-prompt.md`
- `product-initialisation/example.md`
- `product-initialisation/master-prompt-architect.md`

## Modules

### 1. Agent Workflows

A general-purpose orchestration prompt for AI project sessions.

- **[Workflow Generator](agent-workflows/work-flows-generator.md)**: Defines the session roles, quality expectations, and a structured startup process for managing development work with AI.

### 2. Code Evaluator

A production-ready audit prompt for evaluating existing software projects.

- **[Master Prompt](code-evaluator/prodution-quality-and-security-prompt.md)**: Contains the full audit flow, including pre-audit clarification, intake, and a scored validation report.
- **[Example Walkthrough](code-evaluator/example.md)**: Demonstrates the audit process on a fictional project called "Taskly," showing how requirements are clarified and findings are reported.

### 3. Product Initialisation

A design prompt for turning PRDs into architecture blueprints.

- **[Master Prompt](product-initialisation/master-prompt-architect.md)**: Guides technical discovery and generates architecture documentation, database schemas, integration maps, security guidance, and DevOps recommendations.
- **[Example Walkthrough](product-initialisation/example.md)**: Illustrates the prompt flow with a recipe sharing and meal planning app called "Platemate."

## Usage

1. **Audit an existing project** with `code-evaluator/prodution-quality-and-security-prompt.md`.
2. **Design a new product architecture** with `product-initialisation/master-prompt-architect.md`.
3. **Run project sessions** and enforce quality standards using `agent-workflows/work-flows-generator.md`.

## Why Code Smith?

- Provides structured, reusable AI prompt workflows.
- Includes real usage examples to reduce setup friction.
- Supports both evaluation and product architecture use cases.
- Keeps outputs focused on quality, clarity, and production-readiness.

For details, open the individual prompt files and examples in their folders.