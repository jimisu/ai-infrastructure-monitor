# mutation-stamp: sha256=d0fcb8a35eed3e4c842246503def31ec3ed7381d939ab15d347f98a9592971f2
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-09-06T16:04:24.700997Z","feature_name":"Last verified timestamp","feature_path":"features/verified-timestamp.feature","background_hash":"eb31156cb1726ac06b8684048a991d9a813427d6128b19fa50b7f44644e3c7bf","implementation_hash":"sha256:cd4f8f58a5b53771b37bf3e42824517251db83825c1285dab57d5062cde1bff6","scenarios":[{"index":0,"name":"verified-timestamp-001 show last verified state from verification metadata","scenario_hash":"4725bdd9d2248b8312436cb74d4fc1c3cd9267ae1cace5daba4d2570fdcd2b86","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-09-06T16:04:24.700997Z"}]}
# acceptance-mutation-manifest-end

Feature: Last verified timestamp
  The AI Infrastructure Monitor summary page shows when the current evidence set was last verified.

  Background:
    Given the AI Infrastructure Monitor summary page is rendered from the presentation view model

  # verified-timestamp-001
  Scenario Outline: verified-timestamp-001 show last verified state from verification metadata
    Given existing verification metadata has <metadata_value>
    When the summary page is opened
    Then the page displays "Last verified" as <display_value>
    And the timestamp display status is <display_status>
    And evidence publication and retrieval dates are not timestamp sources
    And signal calculations and production datasets are unchanged

    Examples:
      | metadata_value           | display_value        | display_status |
      | 2026-09-06T15:20:30.000Z | 2026-09-06 15:20 UTC | UTC            |
      | MISSING                  | UNAVAILABLE          | UNAVAILABLE    |

  # verified-timestamp-002
  Scenario: verified-timestamp-002 cover timestamp behavior in tests
    Given the last verified timestamp behavior is implemented
    When repository verification is run
    Then unit coverage proves the metadata timestamp and missing metadata paths
    And end-to-end coverage proves the visible summary page timestamp and unavailable state
