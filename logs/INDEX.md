# LiquifyIndexerAPI — logs/ Index

Append-only audit trail of all agent actions.

---

## Files

| File | What's Inside |
|------|--------------|
| [`process.md`](./process.md) | Chronological ledger of every action taken — never edit past entries |
| [`plan_rules_backbone.md`](./plan_rules_backbone.md) | Phase 0 plan: backbone structures for `.agents/rules/` |

---

## Log Entry Format

```markdown
## [YYYY-MM-DD HH:MM] @role — Task Name

- **Summary:** One sentence.
- **Files Modified:** List all changed files.
- **Architectural Decisions:** Why — not what.
- **Next Steps:** Handoff instruction for the next prompt.
```
