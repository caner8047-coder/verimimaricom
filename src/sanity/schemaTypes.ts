import { defineField, defineType } from 'sanity'

const contentBase = defineType({
  name: 'contentBase',
  title: 'Content Base',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text' }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({
      name: 'contentMaturity',
      title: 'Content Maturity',
      type: 'string',
      options: { list: ['seed', 'growing', 'evergreen'] },
      initialValue: 'seed',
    }),
    defineField({ name: 'kind', title: 'Kind', type: 'string' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'reference', to: [{ type: 'tag' }] }] }),
    defineField({
      name: 'relatedContents',
      title: 'Related Contents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'relationType', title: 'Relation Type', type: 'string' }),
            defineField({ name: 'strength', title: 'Strength', type: 'number' }),
            defineField({ name: 'target', title: 'Target', type: 'reference', to: [{ type: 'contentBase' }] }),
          ],
        },
      ],
    }),
  ],
})

const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() })],
})

const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [defineField({ name: 'base', title: 'Base Content', type: 'reference', to: [{ type: 'contentBase' }], validation: (r) => r.required() })],
})

const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'trendScore', title: 'Trend Score', type: 'number' }),
    defineField({ name: 'proficiencyLevel', title: 'Proficiency Level', type: 'number' }),
  ],
})

const metric = {
  type: 'object',
  name: 'caseMetric',
  title: 'Case Metric',
  fields: [
    defineField({ name: 'metricKey', title: 'Metric Key', type: 'string' }),
    defineField({ name: 'metricLabel', title: 'Metric Label', type: 'string' }),
    defineField({ name: 'baselineValue', title: 'Baseline Value', type: 'number' }),
    defineField({ name: 'resultValue', title: 'Result Value', type: 'number' }),
    defineField({ name: 'unit', title: 'Unit', type: 'string' }),
    defineField({ name: 'periodLabel', title: 'Period Label', type: 'string' }),
  ],
}

const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'base', title: 'Base Content', type: 'reference', to: [{ type: 'contentBase' }], validation: (r) => r.required() }),
    defineField({ name: 'clientName', title: 'Client Name', type: 'string' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string' }),
    defineField({ name: 'problemStatement', title: 'Problem Statement', type: 'text' }),
    defineField({ name: 'methodology', title: 'Methodology', type: 'text' }),
    defineField({ name: 'outcomeSummary', title: 'Outcome Summary', type: 'text' }),
    defineField({ name: 'impactScore', title: 'Impact Score', type: 'number' }),
    defineField({ name: 'repoUrl', title: 'Repo URL', type: 'url' }),
    defineField({ name: 'demoUrl', title: 'Demo URL', type: 'url' }),
    defineField({ name: 'architectureDiagramMermaid', title: 'Architecture Diagram (Mermaid)', type: 'text' }),
    defineField({ name: 'metrics', title: 'Metrics', type: 'array', of: [{ type: 'caseMetric' }] }),
  ],
})

export const schemaTypes = [contentBase, tag, blogPost, skill, metric, caseStudy]

