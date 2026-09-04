# Ingestion monitoring

The `Ingestion Monitor` GitHub Actions workflow runs once daily and can also be started manually from the Actions tab with **Run workflow**.

The monitor always executes:

```sh
npm run ingest:all -- --dry-run
```

Aggregate ingestion is also dry-run when no flag is supplied. The workflow retains the explicit flag
to make its non-mutating intent visible. Only `--promote` selects production paths; supplying that
flag is not a substitute for separate human promotion authorization.

It collects, parses, validates, and plans promotions against disposable copies of the canonical stores. It does not promote production observations, commit files, push branches, create pull requests, or merge changes. A Git guard fails the workflow if any tracked file under `data/ingestion/observations` changes.

## Required repository configuration

Configure `SEC_USER_AGENT` as a GitHub Actions repository secret (recommended) or repository variable. Its value must identify the application and include a monitored contact email in accordance with SEC fair-access requirements. The workflow validates that it exists without printing its value.

## Results

The Actions step summary displays per-issuer status, proposed new facts and revisions, failures, downstream verification, and overall health. The complete JSON run report is retained for 30 days as the `ingestion-monitor-report-<run-id>` workflow artifact.

- **NO CHANGE**: all issuers and verification passed, with no proposed factual changes.
- **NEW FACTS DETECTED**: one or more validated new facts would be promoted by a production run.
- **REVISION DETECTED**: one or more version-aware revisions would be promoted.
- **INGESTION FAILURE**: at least one issuer pipeline failed.
- **VERIFICATION FAILURE**: downstream integrity or signal regression verification failed.

These are operational data-quality statuses, not investment alerts or recommendations. Any production promotion remains a separate, explicitly authorized action.
