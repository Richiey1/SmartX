"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Protocol {
  name: string;
  id: string;
  allocation: number; // percentage 0-100
  color: string;
}

export const ProtocolAllocationManager = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([
    { name: 'Aave', id: 'aave', allocation: 60, color: 'bg-purple-500' },
    { name: 'Compound', id: 'compound', allocation: 30, color: 'bg-green-500' },
    { name: 'Uniswap', id: 'uniswap', allocation: 10, color: 'bg-pink-500' },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [tempAllocations, setTempAllocations] = useState<Protocol[]>(protocols);

  const totalAllocation = tempAllocations.reduce((sum, p) => sum + p.allocation, 0);
  const isValid = totalAllocation === 100;

  const handleSliderChange = (id: string, value: number) => {
    setTempAllocations(prev => prev.map(p => 
      p.id === id ? { ...p, allocation: value } : p
    ));
  };

  const handleSave = () => {
    if (isValid) {
      setProtocols(tempAllocations);
      setIsEditing(false);
      // TODO: Call contract to update allocations
    }
  };

  const handleCancel = () => {
    setTempAllocations(protocols);
    setIsEditing(false);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Strategy Allocation</h3>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Adjust Strategy
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Visual Bar */}
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
          {(isEditing ? tempAllocations : protocols).map((p) => (
            <div
              key={p.id}
              className={`h-full ${p.color} transition-all duration-300`}
              style={{ width: `${p.allocation}%` }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {(isEditing ? tempAllocations : protocols).map((p) => (
            <div key={p.id} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${p.color}`} />
              <div className="flex-1 font-medium">{p.name}</div>
              
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={p.allocation}
                    onChange={(e) => handleSliderChange(p.id, parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-12 text-right font-mono">{p.allocation}%</span>
                </div>
              ) : (
                <div className="font-mono text-neutral-muted">{p.allocation}%</div>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                Total: {totalAllocation}%
              </span>
              {!isValid && <span className="text-xs text-red-500">Must equal 100%</span>}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave} disabled={!isValid}>Save Changes</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
