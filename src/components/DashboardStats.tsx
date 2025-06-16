
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsProps {
  totalTransactions: number;
  topBrand: string;
  recentTransactions: number;
}

const DashboardStats: React.FC<StatsProps> = ({ totalTransactions, topBrand, recentTransactions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-primary">Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
            {totalTransactions}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Devices processed
          </div>
        </CardContent>
      </Card>

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-accent">Top Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent glow-text font-['Orbitron']">
            {topBrand || 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Most popular
          </div>
        </CardContent>
      </Card>

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary">Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary glow-text font-['Orbitron']">
            {recentTransactions}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            New transactions
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
