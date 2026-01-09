import { useState } from "react";
import Card from "../../ui/Card/Card";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import styles from "./AuthForm.module.css";

const AuthForm = ({ config, onSubmit, error }) => {
  const initialState = config.fields.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <h1 className={styles.title}>{config.title}</h1>
      <p className={styles.subtitle}>{config.subtitle}</p>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {config.fields.map((field) => (
          <Input
            key={field.name}
            {...field}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ))}

        <Button type="submit">{config.submitLabel}</Button>
      </form>

      <p className={styles.linkText}>
        {config.redirectText.text}{" "}
        <a href={config.redirectText.linkTo}>
          {config.redirectText.linkLabel}
        </a>
      </p>
    </Card>
  );
};

export default AuthForm;
