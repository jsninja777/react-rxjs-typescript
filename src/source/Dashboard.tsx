import React, { useEffect } from 'react';
import { Subject } from 'rxjs';
import { useObservable } from './hoc/useObservable';
import UniqueObservable from './utils/UniqueObservable';
import './Dashboard.css';

const systemsObservable = new Subject<string[]>()
const systemTitles: string[] = ["Temperature", "Air Pressure", "Humidity"];
const colors: string[] = ["#e0e0e0", "#cc9", "#e7c372"];

const Dashboard = () => {
  const displayObjects = useObservable(systemsObservable, []);

  useEffect(() => {
    const uniqueObservable = new UniqueObservable(systemsObservable).subscribe();

    return uniqueObservable.unsubscribe;
  }, [])

  const systemsUi = systemTitles.map((title, i) => (
    <div className="system" key={i} style={{ backgroundColor: colors[i] }}>
      <span className="title">{title}</span>
      <span className="value">{displayObjects.length <= i ? "" : displayObjects[i]}</span>
    </div>
  ))

  return (
    <div className="dashboard">
      {systemsUi}
    </div>
  );
}

export default Dashboard;
