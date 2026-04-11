# Day 18 - 클래스 고급 심화

class BirkmanProfile:
    # 클래스 변수 (모든 객체가 공유)
    version = "1.2"
    count = 0
    
    def __init__(self, name):
        self.name = name
        self.__scores = {}          # Private 변수 (__로 시작)
        BirkmanProfile.count += 1
    
    # 1. 정적 메서드 (@staticmethod) - self 필요 없음
    @staticmethod
    def is_high_score(score):
        """점수가 80점 이상인지 판단"""
        return score >= 80
    
    # 2. 클래스 메서드 (@classmethod) - cls로 클래스 자체를 받음
    @classmethod
    def get_total_profiles(cls):
        return f"현재 생성된 프로필 수: {cls.count}개 (버전 {cls.version})"
    
    # 3. Private 변수 + @property
    def add_score(self, area, score):
        self.__scores[area] = score
    
    @property
    def average_score(self):
        if not self.__scores:
            return 0
        return sum(self.__scores.values()) / len(self.__scores)
    
    @property
    def best_area(self):
        if not self.__scores:
            return None
        return max(self.__scores, key=self.__scores.get)
    
    # 4. 매직 메서드
    def __str__(self):
        return f"BirkmanProfile({self.name}, avg={self.average_score:.1f})"
    
    def __len__(self):
        return len(self.__scores)
        
# ==================== 사용 예시 ====================
print("=== Day 18 클래스 고급 실습 ===\n")

me = BirkmanProfile("동호온")
me.add_score("기술", 97)
me.add_score("야외", 84)
me.add_score("과학", 84)
me.add_score("숫자", 79)

print(me)                    # __str__ 호출
print(f"총 영역 수: {len(me)}개")   # __len__ 호출
print(f"평균 점수: {me.average_score:.1f}%")   # @property 사용
print(f"최고 강점: {me.best_area}")

print("\n정적 메서드 테스트:")
print("기술 97점 → 고득점?", BirkmanProfile.is_high_score(97))
print("문학 34점 → 고득점?", BirkmanProfile.is_high_score(34))

print("\n클래스 메서드:")
print(BirkmanProfile.get_total_profiles())

# 또 하나 생성
you = BirkmanProfile("민수")
print(BirkmanProfile.get_total_profiles())

class WeatherDate:
    def __init__(self, location="부산"):
        self.location = location
        self.__recodfs = []

    def add(self, temp):
        self.__records.append(temp)

    @property
    def average(self):
        return sum(self.__records) / len(self.__records) if self.__records else 0
    
    @property
    def max_remp(self):
        return max(self.__records) if self.__records else None
    
    @staticmethod
    def celsius_to_fathrenheit(c):
        return c * 9/5 +32
    
    def __len__(self):
        return len(self.__records)
    
    def __str__(self):
        return f"WeratherData({self.location}, {len(self)}일 기록, 평균 {self.average:.1f}°C)"