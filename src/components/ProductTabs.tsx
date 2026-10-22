"use client";

import { useState } from "react";

type Spec = { label: string; value: string };
type Section = { title: string; text: string };

const tabs = [
  ["description", "აღწერა"],
  ["specifications", "მახასიათებლები"],
  ["delivery", "მიწოდება"],
] as const;
type Tab = (typeof tabs)[number][0];

/** Description / specs / delivery tabs under the product overview. */
export function ProductTabs({ description, specs, delivery }: { description: string; specs: Spec[]; delivery: Section[] }) {
  const [tab, setTab] = useState<Tab>("description");
  return (
    <section className="product-details" aria-label="პროდუქტის დამატებითი ინფორმაცია">
      <div className="product-detail-tabs" role="tablist" aria-label="პროდუქტის ინფორმაცია">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            id={`${key}-tab`}
            type="button"
            role="tab"
            aria-selected={tab === key}
            aria-controls={`${key}-panel`}
            className={tab === key ? "is-active" : ""}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div id={`${tab}-panel`} className="product-detail-panel" role="tabpanel" aria-labelledby={`${tab}-tab`} tabIndex={0}>
        {tab === "description" && (
          <>
            <h2>პროდუქტის შესახებ</h2>
            {description ? <p>{description}</p> : <p className="product-detail-muted">აღწერა მალე დაემატება.</p>}
          </>
        )}
        {tab === "specifications" && (
          <>
            <h2>პროდუქტის მახასიათებლები</h2>
            {specs.length ? (
              <table className="product-specification-table">
                <tbody>
                  {specs.map((s) => (
                    <tr key={s.label + s.value}>
                      <th scope="row">{s.label}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="product-detail-muted">ზომები და კომპლექტაცია ზუსტდება შეკვეთისას.</p>
            )}
          </>
        )}
        {tab === "delivery" && (
          <>
            {delivery.map((s) => (
              <div key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
