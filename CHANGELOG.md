# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 0.1.0 - 2021-07-08

### Added

- Initial support for ingesting the following entities:

  | Resources | Entity `_type`      | Entity `_class` |
  | --------- | ------------------- | --------------- |
  | Account   | `wp_engine_account` | `Account`       |
  | Domain    | `wp_engine_domain`  | `Domain`        |
  | Install   | `wp_engine_install` | `Application`   |
  | Site      | `wp_engine_site`    | `Host`          |
  | User      | `wp_engine_user`    | `User`          |

- Initial support for ingesting the following relationships:

  | Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
  | --------------------- | --------------------- | --------------------- |
  | `wp_engine_account`   | **HAS**               | `wp_engine_install`   |
  | `wp_engine_account`   | **HAS**               | `wp_engine_site`      |
  | `wp_engine_install`   | **HAS**               | `wp_engine_domain`    |
  | `wp_engine_site`      | **HAS**               | `wp_engine_install`   |
  | `wp_engine_user`      | **MANAGES**           | `wp_engine_account`   |
