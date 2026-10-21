# Project rules

- Define questionnaire section components at module scope, not inside the stateful page; stable component identity preserves input focus while answers change.
- Call every React hook before any conditional early return in a component; a return that can skip hook calls changes the hook count between renders and crashes React.