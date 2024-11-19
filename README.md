# Write Env

Simple tool for env file generation.

You can create env file in workflow from JSON data.

### Use case

Write env from Github Repository Secrets

```yml
- name: Write .env from Github Repository Secrets
  uses: kakekomu/write-env@main
  with:
    env: .env
    json: ${{ toJson(secrets) }}
```

Write env from Github Repository Variables

```yml
- name: Write .env from Github Repository Secrets
  uses: kakekomu/write-env@main
  with:
    env: .env
    json: ${{ toJson(vars) }}
```

### Filter with regular expression

If you don't want to write all properties, you can use regular expressions to
filter keys

When you provide regex, only matched keys are used.

```yml
- name: Write .env Next public env vars from Github Repository Variables
  uses: kakekomu/write-env@main
  with:
    env: .env
    json: ${{ toJson(vars) }}
    regex: ^NEXT_PUBLIC.*
```

### Arguments

Required properties are shown in bold | Name | description | | ---- |--- | |
**env** | Output env file path | | **json** | Json string to write to env file|
| regex | Regex to filter keys |

If an `env` file already exists, content will be appended to the existing file
with `\n`
# ecs-util-actions
# ecs-util-actions
