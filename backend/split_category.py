import pandas as pd

# Load Excel file
df = pd.read_excel("groceries_dataset.xlsx")

# Create new column from first part of breadcrumbs
df["breadcrumbs"] = df["breadcrumbs"].astype(str).str.split("~").str[0].str.strip()

# Save updated file
df.to_excel("groceries_dataset_updated.xlsx", index=False)

print("Done. New file saved as groceries_dataset_updated.xlsx")