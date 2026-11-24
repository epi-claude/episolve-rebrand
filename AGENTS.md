# Project rules

- Define questionnaire section components at module scope, not inside the stateful page; stable component identity preserves input focus while answers change.
- Call every React hook before any conditional early return in a component; a return that can skip hook calls changes the hook count between renders and crashes React.
- Enforce shared questionnaire response and revision access through database policies using the protected role table; client sign-in alone must never authorize shared data.
- Serve the process map's root and namespaced addresses as identical public HTML files, outside React and authentication, to preserve standalone document behavior and existing links.