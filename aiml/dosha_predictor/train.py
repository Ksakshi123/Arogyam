"""
Training script for Ayurvedic Dosha Classification model.
Trains a scikit-learn Pipeline on multi-factorial clinical markers.
"""
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

DATA_PATH = os.path.join(os.path.dirname(__file__), "sample_data.csv")
MODEL_OUT = os.path.join(os.path.dirname(__file__), "dosha_model.joblib")


def train():
    print(f"Loading data from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)

    features = ["frame", "skin", "appetite", "weather_preference", "energy", "sleep", "stress_response"]
    target = "dosha"

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), features)
        ]
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", RandomForestClassifier(n_estimators=50, random_state=42))
        ]
    )

    print("Training Random Forest Classifier...")
    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_test)
    print("Model Evaluation:")
    print(classification_report(y_test, preds, zero_division=0))

    joblib.dump(pipeline, MODEL_OUT)
    print(f"Model successfully saved to {MODEL_OUT}")


if __name__ == "__main__":
    train()
