# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo-powered static site blog that deploys to GitHub Pages. The site "忆秉拾瑜" is a Chinese technology blog focused on incremental learning and building.

- **Framework**: Hexo 8.1.1
- **Theme**: NexT
- **Deployment**: GitHub Pages via hexo-deployer-git
- **Language**: Chinese (zh-CN)
- **Target Repository**: [NGshiyu.github.io](https://github.com/NGshiyu/NGshiyu.github.io)

## Common Commands

### Development Workflow
- `just server` or `just run` - Start local development server (default port 4000)
- `just build` - Generate static files to `public/` directory
- `just deploy` - Build and deploy to GitHub Pages
- `just clean` - Clean generated files and cache

### Alternative npm Commands
- `npm run server` - Start development server
- `npm run build` - Generate static site
- `npm run deploy` - Deploy to GitHub Pages
- `npm run clean` - Clean generated files

### Content Creation
- `npx hexo new post "title"` - Create new blog post
- `npx hexo new draft "title"` - Create draft post
- `npx hexo new page "pagename"` - Create new page

## Architecture

### Directory Structure
- `source/_posts/` - Blog posts in Markdown format
- `source/` - Static assets and pages
- `themes/next/` - NexT theme files
- `public/` - Generated static site (after build)
- `scaffolds/` - Post templates (post.md, draft.md, page.md)

### Key Configuration Files
- `_config.yml` - Main Hexo configuration
- `themes/next/_config.yml` - NexT theme configuration
- `_config.landscape.yml` - Landscape theme config (unused)
- `package.json` - Dependencies and npm scripts
- `justfile` - Custom command aliases
- `.envrc` - Project environment variables (direnv)

### Content Structure
- Posts use Front Matter with title, date, tags, categories
- Default layout: `post`
- URL structure: `/:year/:month/:day/:title/`
- Pagination: 10 posts per page

### Deployment Configuration
- Type: Git
- Repository: `git@github.com:NGshiyu/NGshiyu.github.io.git`
- Branch: `main`
- URL: `http://NGshiyu.github.io`

## Development Notes

### Theme Customization
The site uses NexT theme with extensive configuration options in `themes/next/_config.yml`. Custom file paths can be defined in `source/_data/` directory for further customization.

### Build Process
1. Hexo processes Markdown files in `source/_posts/`
2. Applies theme templates and configurations
3. Generates static HTML/CSS/JS to `public/`
4. Deployment pushes `public/` contents to GitHub Pages

### Environment Setup
Uses direnv for project-level environment variables. The `.envrc` file is configured to export project-specific variables when entering the directory.