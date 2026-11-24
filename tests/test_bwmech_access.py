"""Live policy regression tests. Run: python3 -m unittest discover -s tests."""
import json
import subprocess
import unittest


class BroadwayMechanicalAccessTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(
            ["psql", "-X", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-c",
             "SELECT json_agg(p) FROM (SELECT tablename, cmd, roles, qual, "
             "with_check FROM pg_policies WHERE schemaname='public' AND "
             "tablename IN ('questionnaire_responses','questionnaire_revisions')) p"],
            check=True, capture_output=True, text=True,
        )
        cls.policies = json.loads(result.stdout)

    def assert_admin_only(self, table, expected_commands):
        policies = [p for p in self.policies if p['tablename'] == table]
        self.assertCountEqual([p['cmd'] for p in policies], expected_commands)
        for policy in policies:
            self.assertEqual(policy['roles'], ['authenticated'])
            for clause in ('qual', 'with_check'):
                needs_clause = (
                    clause == 'qual' and policy['cmd'] in ('SELECT', 'UPDATE')
                ) or (
                    clause == 'with_check' and policy['cmd'] in ('INSERT', 'UPDATE')
                )
                if needs_clause:
                    self.assertEqual(
                        policy[clause], "has_role(auth.uid(), 'admin'::app_role)",
                        f"{table} {policy['cmd']} {clause} must require admin role",
                    )

    def test_only_admins_can_access_shared_responses(self):
        self.assert_admin_only('questionnaire_responses', ['SELECT', 'INSERT', 'UPDATE'])

    def test_only_admins_can_access_shared_revision_history(self):
        self.assert_admin_only('questionnaire_revisions', ['SELECT', 'INSERT'])


if __name__ == '__main__':
    unittest.main()