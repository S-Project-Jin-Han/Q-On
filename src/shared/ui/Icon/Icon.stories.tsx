import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon } from './Icon';
import { LUCIDE_NAMES } from './LucideTypes';
import { CUSTOM_NAMES } from './CustomTypes';

type Kind = 'all' | 'lucide' | 'custom';

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    tone: {
      control: 'select',
      options: [
        'default',
        'muted',
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'destructive',
        'info',
      ],
    },
    spin: { control: 'boolean' },
  },
  args: {
    size: 'lg',
    tone: 'primary',
    spin: false,
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

/** 전체 아이콘 미리보기 (Lucide + Custom) */
export const Gallery_All: Story = {
  render: (args) => {
    const [q, setQ] = React.useState('');
    const [kind, setKind] = React.useState<Kind>('all');

    const match = (name: string) =>
      !q || name.toLowerCase().includes(q.toLowerCase());

    const lucideList = kind === 'custom' ? [] : LUCIDE_NAMES.filter(match);
    const customList = kind === 'lucide' ? [] : CUSTOM_NAMES.filter(match);

    const Card: React.FC<{
      title: string;
      count: number;
      children: React.ReactNode;
    }> = ({ title, count, children }) => (
      <section className="rounded-xl border p-4 bg-background/50">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">{title}</h3>
          <span className="text-xs text-muted-foreground">{count}개</span>
        </div>
        {children}
      </section>
    );

    const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {children}
      </div>
    );

    const Cell: React.FC<{ name: string; child: React.ReactNode }> = ({
      name,
      child,
    }) => (
      <div className="flex items-center gap-3 rounded-md border p-3 bg-white/50 dark:bg-black/20">
        <div className="shrink-0">{child}</div>
        <span className="text-xs text-muted-foreground truncate">{name}</span>
      </div>
    );

    return (
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            placeholder="검색 (아이콘 이름)"
            className="h-9 w-64 rounded-md border px-3 text-sm bg-background"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="h-9 rounded-md border px-2 text-sm bg-background"
            value={kind}
            onChange={(e) => setKind(e.target.value as Kind)}
          >
            <option value="all">All</option>
            <option value="lucide">Lucide only</option>
            <option value="custom">Custom only</option>
          </select>

          <div className="ml-auto text-xs text-muted-foreground">
            Lucide: {lucideList.length} / {LUCIDE_NAMES.length} · Custom:{' '}
            {customList.length} / {CUSTOM_NAMES.length}
          </div>
        </div>

        {/* Lucide 섹션 */}
        {lucideList.length > 0 && (
          <Card title="Lucide Icons" count={lucideList.length}>
            <Grid>
              {lucideList.map((name) => (
                <Cell
                  key={`l-${name}`}
                  name={name}
                  child={
                    <Icon
                      lucideName={name}
                      size={args.size}
                      tone={args.tone}
                      spin={args.spin}
                      decorative
                    />
                  }
                />
              ))}
            </Grid>
          </Card>
        )}

        {/* Custom 섹션 */}
        {customList.length > 0 && (
          <Card title="Custom Icons" count={customList.length}>
            <Grid>
              {customList.map((name) => (
                <Cell
                  key={`c-${name}`}
                  name={name}
                  child={
                    <Icon
                      customName={name}
                      size={args.size}
                      tone={args.tone === 'default' ? 'primary' : args.tone}
                      spin={args.spin}
                      decorative
                    />
                  }
                />
              ))}
            </Grid>
          </Card>
        )}

        {/* 결과 없음 */}
        {lucideList.length === 0 && customList.length === 0 && (
          <div className="text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    );
  },
};
