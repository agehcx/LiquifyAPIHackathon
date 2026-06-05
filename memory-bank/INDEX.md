# memory-bank/ — Index

The memory bank is the single source of truth for project state and technical decisions.
`@developer` and `@architect` must read relevant files here before acting.

---

## Files

| File | What's Inside | Read Frequency |
|------|--------------|----------------|
| [`current-state.md`](./current-state.md) | What is built, what is broken, what is next | **Every session — before any action** |
| [`projectbrief.md`](./projectbrief.md) | Core vision, target audience, MVP scope, out-of-scope items | Before any feature work or scope decision |
| [`techstack.md`](./techstack.md) | Approved packages, forbidden packages, proposal queue | Before importing any dependency |

---

## Update Rules

| File | Who Updates | When |
|------|-------------|------|
| `current-state.md` | `@developer` | After every meaningful code change |
| `projectbrief.md` | `@architect` / User | When scope changes or MVP is defined |
| `techstack.md` | `@architect` | When a new package is approved or banned |
