import React, { useState, useEffect } from "react";
import { getNotifications, subscribeNotifications, markAllNotificationsAsRead } from "./notificationStore";

export default function Notifications() {
    const [notifications, setNotifications] = useState(getNotifications());

    useEffect(() => {
        const unsubscribe = subscribeNotifications((updated) => {
            setNotifications(updated);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 className="text-2xl font-bold text-[#16221f]" style={{ margin: 0 }}>Notifications</h1>
                <button 
                    onClick={markAllNotificationsAsRead}
                    style={{ 
                        background: "none", border: "none", color: "#0f9e8e", 
                        fontWeight: 600, cursor: "pointer", fontSize: "14px"
                    }}
                >
                    Mark all as read
                </button>
            </div>

            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #eef2f1", overflow: "hidden" }}>
                {notifications.map((notif, index) => (
                    <div key={notif.id} style={{
                        padding: "20px 24px",
                        borderBottom: index === notifications.length - 1 ? "none" : "1px solid #f1f4f3",
                        background: notif.unread ? "#f8fbfa" : "#ffffff",
                        display: "flex", gap: "16px", alignItems: "flex-start"
                    }}>
                        <div style={{
                            width: "10px", height: "10px", borderRadius: "50%",
                            background: notif.unread ? "#0f9e8e" : "transparent",
                            marginTop: "6px", flexShrink: 0
                        }}></div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", color: "#16221f" }}>{notif.title}</h4>
                            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#55645f" }}>{notif.message}</p>
                            <span style={{ fontSize: "12px", color: "#8a9591", fontWeight: 500 }}>{notif.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
