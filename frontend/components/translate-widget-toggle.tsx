"use client";
import { useEffect, useRef } from "react";

export default function TranslateWidgetToggle({ show }: { show: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const attachedRef = useRef(false);

  useEffect(() => {
    let tries = 0;
    const maxTries = 60; // ~3s at 50ms
  const attach = () => {
      if (!containerRef.current) return false;
      const el = document.getElementById("google_translate_element");
      if (el && el.parentElement !== containerRef.current) {
        containerRef.current.appendChild(el);
        // Clear offscreen styles set during init so dropdown renders normally
        el.style.position = "";
        el.style.top = "";
        el.style.left = "";
        el.style.visibility = "";
        el.style.display = "block"; // keep inner element visible; outer controls visibility
        attachedRef.current = true;
        return true;
      }
      return !!(el && el.parentElement === containerRef.current);
    };

    if (!attach()) {
      const interval = window.setInterval(() => {
        tries++;
        if (attach() || tries >= maxTries) {
          window.clearInterval(interval);
        }
      }, 50);
      return () => window.clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.display = show ? "block" : "none";
    }
  }, [show]);

  return (
    <div
      id="google_translate_widget_container"
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        padding: '4px 8px',
        minWidth: 140,
        display: show ? 'block' : 'none',
      }}
      aria-hidden={!show}
    />
  );
}