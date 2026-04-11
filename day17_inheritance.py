# Day 17 - 클래스 상속 (Inheritance)

# 1. 부모 클래스
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"안녕하세요! 저는{self.name}이고, {self.age}살입니다.")

    def __str__(self):             # 객체를 print() 할 때 예쁘게 출력
        return f"Person(name={self.name}, age={self.age})"
    
# 2. 자식 클래스 (상속)
class Student(Person):              # Person을 상속받음
    def __init__(self, name, age, student_id, major):
        super().__init__(name, age)     # 부모의 __init__ 호출
        self.student_id = student_id
        self.major = major
        self.scores = []

    def add_score(self, score):
        self.scores.append(score)

    def get_average(self):
        if not self.scores:
            return 0
        return sum(self.scores) / len(self.scores)
    
    # 메서드 오버라이딩 (부모 메서드 덮어쓰기)
    def introduce(self):
        print(f"안녕하세요! {self.name}입니다. {self.major}전공하고 있어요")
        print(f"학번: {self.student_id}, 평균 성적: {self.get_average():.1f}점")

# 3. 또 다른 자식 클래스
class Employee(Person):
    def __init__(self, name, age, company, position):
        super().__init__(name, age)
        self.company = company
        self.position = position
        self.birkman_score = 0

    def set_birkman(self, score):
        self.birkman_score = score

    def introduce(self):
        print(f"저는 {self.company} {self.position} {self.name}입니다.")
        print(f"버크만 기술 점수: {self.birkman_score}%")


# ==================== 실제 사용 ====================
print("=== 클래스 상속 실습 ===\n")

student = Student("최동호온", 25, "20251234", "컴퓨터공학과")
student.add_score(95)
student.add_score(88)
student.add_score(92)
student.introduce()

print("\n" + "="*40)

employee = Employee("김개발", 28, "해양드론기술", "소프트웨어 엔지니어")
employee.set_birkman(97)
employee.introduce()

print("\n객체 직접 출력:")
print(student)
print(employee)

class BirkmanProfile:
    def __init__(self, name):
        self.name = name
        self.scores = {}
    
    def add_score(self, area, score):
        self.scores[area] = score
    
    def show(self):
        print(f"\n=== {self.name}님 버크만 프로필 ===")
        for area, score in sorted(self.scores.items(), key=lambda x: x[1], reverse=True):
            print(f"{area:>6}: {score}%")

# 상속받아 확장한 클래스
class AdvancedBirkman(BirkmanProfile):
    def __init__(self, name, job_interest="IT/해양"):
        super().__init__(name)
        self.job_interest = job_interest
        self.recommend = []
    
    def recommend_job(self):
        best = max(self.scores, key=self.scores.get)
        self.recommend.append(best)
        print(f"\n📌 {self.name}님에게 추천하는 직무: {best} 관련")
        print(f"관심 분야: {self.job_interest}")

# 사용 예시
me = AdvancedBirkman("동호온", "해양/IT")
me.add_score("기술", 97)
me.add_score("야외", 84)
me.add_score("과학", 84)
me.add_score("숫자", 79)

me.show()
me.recommend_job()