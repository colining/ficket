import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { read } from '../utils/JsonUtils';

export default function HomePage() {
  const [sources, setSources] = useState(read());

  useEffect(() => {
    setSources(read());
  }, []);

  const renderSourceRemind = () => {
    if (_.isEmpty(sources)) {
      return <h4>没有发现可用的源，请扫描二维码添加源</h4>;
    }

    return null;
  };
  return (
    <div>
      <h4>首页正在施工中</h4>
      {renderSourceRemind()}
    </div>
  );
}
