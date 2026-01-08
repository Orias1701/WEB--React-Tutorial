import { useEffect, useState } from "react";

import styles from "./App.module.css";
import { getLandingContent, joinWaitlist } from "./services/api";

const initialFormData = {
  name: "",
  email: "",
  company: "",
  role: ""
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function App() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadContent() {
    setLoading(true);
    setError("");

    try {
      const landingContent = await getLandingContent();
      setContent(landingContent);
    } catch (requestError) {
      setError(requestError.message || "Unable to load page content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    setFormError("");
    setSubmitMessage("");
  }

  function validateForm() {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return "Please enter a full name with at least 2 characters.";
    }

    if (!emailPattern.test(trimmedEmail)) {
      return "Please provide a valid email address.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setSubmitMessage("");
    setIsSubmitting(true);

    try {
      const response = await joinWaitlist({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim(),
        role: formData.role.trim()
      });

      setSubmitMessage(response.message || content.waitlist?.successMessage || "Waitlist request saved.");
      setFormData(initialFormData);
    } catch (requestError) {
      setFormError(requestError.message || "Unable to submit your request right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.statusView}>
        <div className={styles.spinner} aria-hidden="true" />
        <p>Loading prelaunch experience...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statusView}>
        <p>{error}</p>
        <button type="button" className={styles.retryButton} onClick={loadContent}>
          Retry
        </button>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const {
    brand = {},
    hero = {},
    highlights = [],
    problemSolution = {},
    features = [],
    workflow = [],
    useCases = [],
    faq = [],
    waitlist = {},
    footer = {}
  } = content;

  return (
    <div className={styles.page}>
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <header className={styles.siteHeader}>
        <nav className={styles.navbar} aria-label="Primary navigation">
          <a href="#top" className={styles.brandBlock}>
            <p className={styles.brandName}>{brand.name}</p>
            <p className={styles.brandSlogan}>{brand.slogan}</p>
          </a>
          <a href="#waitlist" className={styles["btn-primary"]}>
            Get Invite
          </a>
        </nav>
      </header>

      <main className={styles.mainContent} id="top">
        <section className={`${styles.hero} ${styles.reveal}`} aria-labelledby="hero-title">
          <article className={styles.heroContent}>
            <p className={styles.pillBadge}>{hero.badge}</p>
            <h1 id="hero-title" className={styles["gradient-text"]}>
              {hero.headline}
            </h1>
            <p className={styles.heroText}>{hero.subheadline}</p>

            <div className={styles.heroActions}>
              <a href="#waitlist" className={styles["btn-primary"]}>
                {hero.primaryCta}
              </a>
              <a href="#features" className={styles["btn-secondary"]}>
                {hero.secondaryCta}
              </a>
            </div>

            <p className={styles.trustLine}>{hero.trustLine}</p>
          </article>

          <aside className={`${styles.card} ${styles.heroAside}`}>
            <p className={styles.cardEyebrow}>What you can expect</p>
            <ul className={styles.statsList}>
              {highlights.map((item, index) => (
                <li key={`${item.title}-${index}`} className={`${styles["stat-card"]} ${styles.interactiveCard}`}>
                  <p className={styles.statTitle}>{item.title}</p>
                  <p className={styles.statCopy}>{item.description}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className={`${styles.section} ${styles.reveal}`}>
          <header className={styles.sectionHeader}>
            <p className={styles.sectionTag}>Pain to Progress</p>
            <h2>Replace fragmented execution with orchestrated flow.</h2>
          </header>

          <div className={styles.gridTwo}>
            <article className={`${styles.card} ${styles.interactiveCard}`}>
              <h3>{problemSolution.problemTitle}</h3>
              <p>{problemSolution.problemText}</p>
            </article>
            <article className={`${styles.card} ${styles.interactiveCard}`}>
              <h3>{problemSolution.solutionTitle}</h3>
              <p>{problemSolution.solutionText}</p>
            </article>
          </div>
        </section>

        <section id="features" className={`${styles.section} ${styles.reveal}`}>
          <header className={styles.sectionHeader}>
            <p className={styles.sectionTag}>Capabilities</p>
            <h2>Built for teams shipping in high-context environments.</h2>
          </header>

          <div className={styles.gridFeature}>
            {features.map((feature, index) => (
              <article key={`${feature.label}-${index}`} className={`${styles.card} ${styles.interactiveCard}`}>
                <h3>{feature.label}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.reveal}`}>
          <header className={styles.sectionHeader}>
            <p className={styles.sectionTag}>Workflow</p>
            <h2>Three moves from idea to approved output.</h2>
          </header>

          <div className={styles.gridWorkflow}>
            {workflow.map((item, index) => (
              <article key={`${item.step}-${index}`} className={`${styles.card} ${styles.interactiveCard}`}>
                <p className={styles.stepBadge}>{item.step}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.reveal}`}>
          <header className={styles.sectionHeader}>
            <p className={styles.sectionTag}>Use Cases</p>
            <h2>Early use cases with measurable time gains.</h2>
          </header>

          <div className={styles.gridUseCases}>
            {useCases.map((useCase, index) => (
              <article key={`${useCase.title}-${index}`} className={`${styles.card} ${styles.interactiveCard}`}>
                <h3>{useCase.title}</h3>
                <p>{useCase.summary}</p>
                <p className={styles.metricPill}>{useCase.metric}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.reveal}`}>
          <header className={styles.sectionHeader}>
            <p className={styles.sectionTag}>FAQ</p>
            <h2>Answers before your first invite wave.</h2>
          </header>

          <div className={styles.faqList}>
            {faq.map((item, index) => (
              <details key={`${item.question}-${index}`} className={`${styles.card} ${styles.faqItem} ${styles.interactiveCard}`}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="waitlist" className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.waitlistGrid}>
            <article className={`${styles.card} ${styles.waitlistIntro}`}>
              <p className={styles.sectionTag}>Early Access</p>
              <h2>{waitlist.title}</h2>
              <p>{waitlist.description}</p>
              <p className={styles.privacyText}>{waitlist.privacyNote}</p>
            </article>

            <form className={`${styles.card} ${styles.waitlistForm}`} onSubmit={handleSubmit} noValidate>
              <label className={styles.inputLabel} htmlFor="name">
                Name
              </label>
              <input
                className={styles.inputField}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Alex Morgan"
                autoComplete="name"
              />

              <label className={styles.inputLabel} htmlFor="email">
                Work email
              </label>
              <input
                className={styles.inputField}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="alex@company.com"
                autoComplete="email"
              />

              <label className={styles.inputLabel} htmlFor="company">
                Company
              </label>
              <input
                className={styles.inputField}
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Northstar Labs"
                autoComplete="organization"
              />

              <label className={styles.inputLabel} htmlFor="role">
                Role
              </label>
              <input
                className={styles.inputField}
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Product Operations"
                autoComplete="organization-title"
              />

              {formError ? <p className={styles.formError}>{formError}</p> : null}
              {submitMessage ? <p className={styles.formSuccess}>{submitMessage}</p> : null}

              <button type="submit" className={`${styles["btn-primary"]} ${styles.submitButton}`} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Join waitlist"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className={styles.siteFooter}>
        <p>{footer.copyright}</p>
        <a href={`mailto:${footer.email}`}>{footer.email}</a>
        <nav className={styles.footerLinks} aria-label="Social links">
          {(footer.socials || []).map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}

export default App;
