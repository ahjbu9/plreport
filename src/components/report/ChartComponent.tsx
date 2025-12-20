import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { getPlatformColor } from './PlatformIcons';

interface ChartComponentProps {
  data: { name: string; value: number; color?: string }[];
  type: 'bar' | 'pie' | 'line';
  title?: string;
}

const COLORS = ['#00796b', '#d4af37', '#2196F3', '#FF5722', '#9C27B0', '#4CAF50', '#FF9800', '#795548'];

export function ChartComponent({ data, type, title }: ChartComponentProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || getPlatformColor(item.name) || COLORS[index % COLORS.length]
  }));

  return (
    <div className="w-full h-64 mt-4">
      {title && <h5 className="text-sm font-medium text-muted-foreground mb-2 text-center">{title}</h5>}
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number) => value.toLocaleString('ar-EG')}
              contentStyle={{ direction: 'rtl', textAlign: 'right' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        ) : type === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => value.toLocaleString('ar-EG')}
              contentStyle={{ direction: 'rtl', textAlign: 'right' }}
            />
            <Legend />
          </PieChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => value.toLocaleString('ar-EG')}
              contentStyle={{ direction: 'rtl', textAlign: 'right' }}
            />
            <Line type="monotone" dataKey="value" stroke="#00796b" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
