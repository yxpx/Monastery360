"use client";
import Translate from "../app/translate";

export default function TranslateWidgetToggle({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      id="google_translate_widget_container"
      style={{
        position: 'fixed',
        top: 110,
        right: 40,
        zIndex: 9999,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '2px 8px',
        minWidth: 120,
      }}
    >
      <div id="google_translate_element" />
      <Translate />
    </div>
  );
}