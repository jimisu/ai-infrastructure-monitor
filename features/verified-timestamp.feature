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
