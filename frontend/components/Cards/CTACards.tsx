
import { useCTAContext } from "../Clients/CTAClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
export default function CTACard() {
    const { isLoading, currentTimeLine } = useCTAContext();
    return (<div className="card">
        {/* <div className="card-header">
                <h2>Comments Added per Minute</h2>
                {durations != null && (
                    <span className="duration">{durations.commentsByMinute.toFixed(1)} ms</span>
                )}
            </div> */}
        {!isLoading && (
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={currentTimeLine}>
                    <XAxis
                        dataKey="minute"
                        tickFormatter={(v) => new Date(v.replace(' ', 'T')).toLocaleTimeString()}
                        minTickGap={40}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip labelFormatter={(v) => new Date((v as string).replace(' ', 'T')).toLocaleTimeString()} />
                    <Line type="monotone" dataKey="comment_count" stroke="#16a34a" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )}
    </div>)
}