# GitHub Branch Protection Rules
# 
# Para configurar essas regras via interface do GitHub:
# 1. Vá para Settings -> Branches no repositório
# 2. Clique em "Add rule" para a branch main
# 3. Configure as seguintes opções:
#
# ✅ Require a pull request before merging
#   ✅ Dismiss stale PR approvals when new commits are pushed
#   ✅ Require review from code owners
#   
# ✅ Require status checks to pass before merging
#   ✅ Require branches to be up to date before merging
#   ✅ Status checks to require:
#     - test (CI/CD Pipeline)
#     - lint (CI/CD Pipeline)
#     - security (CI/CD Pipeline)
#
# ✅ Require conversation resolution before merging
# ✅ Restrict pushes that create files larger than 100 MB
# ✅ Do not allow bypassing the above settings

# Este arquivo serve como documentação das regras de proteção da branch.
# As regras devem ser configuradas manualmente no GitHub via interface web.

# Comandos alternativos usando GitHub CLI (gh):
# gh api repos/:owner/:repo/branches/main/protection -X PUT --input protection-rules.json

# Exemplo de protection-rules.json:
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "test",
      "lint", 
      "security"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_conversation_resolution": true
}
