import React, { useEffect, useState } from 'react';
import { read } from '../utils/JsonUtils';
import SourceReminder from './SourceReminder';

export default function HomePage() {
  const [sources, setSources] = useState(read());

  useEffect(() => {
    setSources(read());
  }, []);

  return (
    <div>
      <h4>首页正在施工中</h4>
      <SourceReminder sources={sources} />
    </div>
  );
}
