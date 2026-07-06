import { useMemo } from 'react';
import { ModelView } from '@/models/ModelView';
import { generators } from '@/models/registry';
import { useApp } from '@/state/app';

/** Renders whichever component is active; remounts (and disposes) on switch. */
export function ActiveModel() {
  const active = useApp((s) => s.activeComponent);
  const model = useMemo(() => generators[active](), [active]);
  return <ModelView key={active} model={model} />;
}
