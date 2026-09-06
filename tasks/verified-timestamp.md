# verified-timestamp

Add a visible “Last verified” timestamp to the AI Infrastructure
Monitor summary page.

Do not change signal calculations or production datasets.

Acceptance criteria:
1. The timestamp comes from existing verification metadata.
2. It is displayed in UTC.
3. Missing metadata produces a clear unavailable state.
4. Existing tests continue to pass.
5. Add appropriate unit and end-to-end coverage.
