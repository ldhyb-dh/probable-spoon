# birkman_profile.py
import json
from datetime import datetime

class BirkmanProfile:
    def __init__(self, name):
        self.name = name
        self.scores = {}
        self.records = []

    def add_score(self, area, score):
        if not 0 <= score <= 100:
            raise ValueError("점수는 0~100 사이여야 합니다.")
        self.scores[area] = score

    def add_record(self, note=""):
        record = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "scores": self.scores.copy(),
            "note": note
        }
        self.records.append(record)

    def get_average(self):
        return sum(self.scores.values()) / len(self.scores) if self.scores else 0
    
    def get_best_area(self):
        return max(self.scores, key=self.scores.get) if self.scores else None
    
    def save_to_file(self, filename="data/birkman_data.json"):
        try:
            data = {
                "name": self.name,
                "scores": self.scores,
                "records": self.records
            }
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"{filename}에 저장 완료!")
        except Exception as e:
            print(f"저장 실패: {e}")
    @classmethod
    def load_from_file(cls, filename="data/birkman_data.json"):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                data = json.load(f)
            profile = cls(data["name"])
            profile.scores = data["scores"]
            profile.records = data.get("records",[])
            return profile
        except FileNotFoundError:
            print("저장된 파일이 없습니다. 새로 시작합니다.")
            return cls("동훈")
        except Exception:
            print("파일 로드 중 오류 발생")
            return cls("동훈")