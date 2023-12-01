import mongoose from "mongoose";

const patientSchema = mongoose.Schema(
  {
    allocated: {
      type: String,
    },
    patientId: {
      type: Number,
    },
    aadharNumber: {
      type: String,
    },
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    age: {
      type: Number,
    },
    sex: {
      type: String,
    },
    address: {
      type: String,
    },
    disctrict: {
      type: String,
    },
    taluk: {
      type: String,
    },

    phone: {
      type: String,
    },

    community: {
      type: String,
    },

    education_in_year: {
      type: String,
    },

    occupation: {
      type: String,
    },

    annual_income: {
      type: String,
    },

    marital_status: {
      type: String,
    },

    living_arrangement: {
      type: String,
    },

    refferal: {
      type: String,
    },

    complaints: [
      {
        drug_type: {
          type: String,
        },
        drug: {
          type: String,
        },
        age_of_first_use: {
          type: String,
        },
        year_use: {
          type: String,
        },
        year_excessive_use: {
          type: String,
        },
        frequency_last_30_days: {
          type: String,
        },
        quantity_last_30_days: {
          type: String,
        },
        route_stration: {
          type: String,
        },
      },
    ],

    reason_start: {
      type: String,
    },
    reason_continue: {
      type: String,
    },

    stressors: {
      type: String,
    },

    last_use_date: {
      type: Date,
    },

    last_use_quantity: {
      type: String,
    },

    impression_of_camp_officer: {
      type: String,
    },

    denial_of_substance_use_related_problems: {
      type: String,
    },

    motivation_factor: {
      type: String,
    },

    willingness_for_treatment: {
      type: String,
    },

    action_taken: {
      type: String,
    },

    weight_while_admission_in_kg: {
      type: String,
    },

    weight_while_discharge_in_kg: {
      type: String,
    },

    height_in_ft: {
      type: String,
    },

    sugar_in_mg: {
      type: String,
    },

    other_issues: {
      type: String,
    },

    withdrawal_symptoms_experienced_when_the_patient_stopped: {
      type: String,
    },

    past_medical_problem: {
      type: String,
    },

    present_medical_problem: {
      type: String,
    },

    chronic_health_problem: {
      type: String,
    },

    past_psychiatric_complication: {
      type: String,
    },

    present_psychiatric_complication: {
      type: String,
    },

    history_of_previous_head_injureies: {
      type: String,
    },

    family_history: [
      {
        member: {
          type: String,
        },
        age: {
          type: Number,
        },
        state_of_health: {
          type: String,
        },
        year_of_death: {
          type: String,
        },
        cause_of_death: {
          type: String,
        },
        age_at_death: {
          type: String,
        },
      },
    ],

    family_health_status: [
      {
        member: {
          type: String,
        },
        problem: {
          type: String,
        },
        state: {
          type: String,
        },
      },
    ],

    extra_marital_experience: {
      type: String,
    },
    premarital_sexual_encounter: {
      type: String,
    },
    involved_high_risk_sexual_activity: {
      type: String,
    },
    sexual_problems: {
      type: String,
    },
    spouse_name: {
      type: String,
    },
    spouse_age: {
      type: String,
    },
    spouse_religion: {
      type: String,
    },
    spouse_education: {
      type: String,
    },
    spouse_occupation: {
      type: String,
    },
    spouse_monthly_income: {
      type: String,
    },
    marriage_years: {
      type: String,
    },
    marriage_type: {
      type: String,
    },
    other_marriage: {
      type: String,
    },
    marriage_seperation_due_to_addication: {
      type: String,
    },
    longest_marriage_seperation: {
      type: String,
    },
    suspicious_of_wife: {
      type: String,
    },
    family_violence: {
      type: String,
    },
    occupation_age: {
      type: String,
    },
    occupation_duration: {
      type: String,
    },
    occupation_award: {
      type: String,
    },
    job_change_frequently: {
      type: String,
    },
    period_of_unemployment: {
      type: String,
    },
    reason_for_unemployment: {
      type: String,
    },
    occupational_damage: {
      type: String,
    },
    financial_debt: {
      type: String,
    },
    financial_debt_amount: {
      type: String,
    },
    weeklyReport: [
      {
        name: {
          type: String,
        },
        day_1: {
          type: String,
        },
        day_2: {
          type: String,
        },
        day_3: {
          type: String,
        },
        day_4: {
          type: String,
        },
        day_5: {
          type: String,
        },
        day_6: {
          type: String,
        },
        day_7: {
          type: String,
        },
      },
    ],

    financial_history: {
      debts: {
        type: String,
      },
      amount: {
        type: Number,
      },
    },

    legal_history: [
      {
        name: {
          type: String,
        },
        arrest_time: {
          type: Number,
        },
      },
    ],

    childhood_history: {
      detail: {
        type: String,
      },
      behaviour_problem: {
        type: String,
      },
    },

    educational_history: {
      achievements: {
        type: String,
      },
      years_of_education: {
        type: Number,
      },
      extracurricular_activities: {
        type: String,
      },
    },

    religious_beliefs: {
      type: String,
    },

    past_Treatment_history: {
      detail: {
        type: String,
      },
      psychological_factor_for_continuation: {
        type: String,
      },
      maximum_period_of_absistance: {
        type: String,
      },
      significant_psychological_problems: {
        type: String,
      },
      final_diagnosis_full: {
        type: String,
      },
      clinical_global_impression: {
        type: String,
      },
      doctor_initial: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
